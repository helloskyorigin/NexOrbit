import { NextRequest, NextResponse } from 'next/server';
import { ActionEngine } from '../../../services/actions/action.engine';
import { ConnectorService } from '../../../services/connectors/connector.service';
import { handleApiError } from '../../../lib/errors';

const actionEngine = new ActionEngine();
const connectorService = new ConnectorService();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId || 'user_demo_phase0';
    const actionType = body.actionType || 'MOCK_SEND_SUMMARY';
    const targetConnector = body.targetConnector || 'GMAIL';

    // 1. Prepare
    const action = await actionEngine.prepareAction(
      userId,
      actionType,
      targetConnector,
      body.payload || { recipient: 'team@nexorbit.ai' }
    );

    // Auto-connect connector in test environment if needed
    await connectorService.connectConnector(userId, targetConnector, {
      accountEmail: `${userId}@test.com`,
    });

    // 2. Verify
    const verifyResult = await actionEngine.verifyAction(userId, action.id);

    // 3. Request Approval
    const approval = await actionEngine.requestApproval(
      userId,
      action.id,
      `Approve action: ${actionType} on ${targetConnector}`
    );

    // Auto-approve for simulation
    approval.status = 'APPROVED';

    // 4. Execute
    const executed = await actionEngine.executeAction(userId, action.id, approval.id);

    // 5. Verify Result
    const resultVerify = await actionEngine.verifyResult(userId, action.id);

    // 6. Complete
    const completed = await actionEngine.completeAction(userId, action.id);

    return NextResponse.json({
      success: true,
      lifecycleSummary: {
        stage1_prepare: action,
        stage2_verify: verifyResult,
        stage3_approval: approval,
        stage4_executed: executed,
        stage5_resultVerification: resultVerify,
        stage6_completed: completed,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
