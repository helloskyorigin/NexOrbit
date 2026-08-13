import {
  AskConversation,
  SourceItem,
  AskResponseData,
  ContextEntity,
} from './types';

export const MOCK_SOURCES: SourceItem[] = [
  {
    id: 'src-gmail-1',
    connector: 'gmail',
    connectorName: 'Gmail',
    title: 'Client deadline discussion',
    snippet: 'Rahul mentioned: "We are aiming for Friday COB to submit the final spec review."',
    timestamp: 'Aug 12, 4:15 PM',
  },
  {
    id: 'src-cal-1',
    connector: 'calendar',
    connectorName: 'Calendar',
    title: 'Project Alpha Sync',
    snippet: 'Event scheduled for Monday 10:00 AM with Rahul and Dev leads.',
    timestamp: 'Aug 15, 10:00 AM',
  },
  {
    id: 'src-drive-1',
    connector: 'drive',
    connectorName: 'Drive',
    title: 'Project Alpha Proposal',
    snippet: 'Document version v2.4 lists target delivery as Monday August 18.',
    timestamp: 'Updated Aug 10',
  },
];

export const MOCK_PROJECT_ALPHA_RESPONSE: AskResponseData = {
  id: 'resp-alpha-1',
  summaryText: 'Yes. I found 3 things worth your attention.',
  insights: [
    {
      id: 'ins-1',
      title: 'Deadline conflict',
      content:
        'Your latest client email mentions Friday, while your calendar and project document show Monday.',
      priority: 'high',
      sources: [MOCK_SOURCES[0], MOCK_SOURCES[1], MOCK_SOURCES[2]],
    },
    {
      id: 'ins-2',
      title: 'Client response pending',
      content: "Rahul hasn't responded to the latest project discussion.",
      priority: 'medium',
      sources: [MOCK_SOURCES[0]],
    },
    {
      id: 'ins-3',
      title: 'Meeting tomorrow',
      content: 'Project Alpha sync is scheduled for 10:00 AM.',
      priority: 'info',
      sources: [MOCK_SOURCES[1]],
    },
  ],
  recommendedNextStep: {
    text: 'Resolve the deadline before the meeting.',
    actionLabel: 'Prepare response',
  },
  sources: MOCK_SOURCES,
  whyExplanation:
    'These sources appear related because they reference Project Alpha and the same client (Rahul) across your connected workspace.',
};

export const MOCK_EMPTY_SUGGESTIONS = [
  {
    category: 'Understand',
    iconName: 'Brain',
    items: [
      { text: 'What changed this week?', prompt: 'What changed this week across Gmail, Calendar, and Drive?' },
      { text: 'What happened in my last meeting?', prompt: 'Summarize key action items from my last meeting.' },
    ],
  },
  {
    category: 'Find',
    iconName: 'Search',
    items: [
      { text: 'Find everything related to Project Alpha.', prompt: 'Is there anything important I should know about Project Alpha?' },
      { text: 'Where is the latest proposal?', prompt: 'Find the latest project proposal document.' },
    ],
  },
  {
    category: 'Connect',
    iconName: 'GitMerge',
    items: [
      { text: 'Are there any deadline conflicts?', prompt: 'Are there any deadline conflicts between my emails and calendar?' },
      { text: 'What information is related to Rahul?', prompt: 'Synthesize all recent emails, meetings, and notes related to Rahul.' },
    ],
  },
  {
    category: 'Act',
    iconName: 'Zap',
    items: [
      { text: 'Prepare a follow-up.', prompt: 'Draft a follow-up response regarding Project Alpha status.' },
      { text: 'Prepare my meeting brief.', prompt: 'Generate a briefing doc for my upcoming 10:00 AM sync.' },
    ],
  },
];

export const INITIAL_CONVERSATIONS: AskConversation[] = [
  {
    id: 'conv-project-alpha',
    title: 'Project Alpha status',
    updatedAt: 'Just now',
    messages: [
      {
        id: 'msg-1',
        sender: 'user',
        text: 'Is there anything important I should know about Project Alpha?',
        timestamp: '10:42 AM',
      },
      {
        id: 'msg-2',
        sender: 'ai',
        text: 'Yes. I found 3 things worth your attention.',
        timestamp: '10:42 AM',
        aiData: MOCK_PROJECT_ALPHA_RESPONSE,
      },
    ],
  },
  {
    id: 'conv-changed-week',
    title: 'What changed this week?',
    updatedAt: 'Yesterday',
    messages: [
      {
        id: 'msg-w1',
        sender: 'user',
        text: 'What changed this week?',
        timestamp: 'Yesterday 4:00 PM',
      },
      {
        id: 'msg-w2',
        sender: 'ai',
        text: 'Here is a synthesis of weekly updates across your workspace.',
        timestamp: 'Yesterday 4:00 PM',
        aiData: {
          id: 'resp-week-1',
          summaryText: '3 important conversations, 1 rescheduled meeting, and 2 updated proposals found.',
          insights: [
            {
              id: 'ins-w1',
              title: 'Proposal updated',
              content: 'Alpha_Launch_Doc_v2.pdf was updated by Product lead.',
              priority: 'info',
              sources: [MOCK_SOURCES[2]],
            },
          ],
          sources: [MOCK_SOURCES[0], MOCK_SOURCES[2]],
          whyExplanation: 'Compiled based on activity across Drive and Gmail over the last 7 days.',
        },
      },
    ],
  },
  {
    id: 'conv-meeting-brief',
    title: "Prepare tomorrow's meeting",
    updatedAt: '2 days ago',
    messages: [
      {
        id: 'msg-m1',
        sender: 'user',
        text: "Prepare my brief for tomorrow's Project Alpha sync.",
        timestamp: '2 days ago',
      },
      {
        id: 'msg-m2',
        sender: 'ai',
        text: 'Brief prepared with agenda topics and outstanding questions.',
        timestamp: '2 days ago',
        aiData: {
          id: 'resp-m-1',
          summaryText: 'Sync agenda centered on timeline alignment.',
          insights: [
            {
              id: 'ins-m1',
              title: 'Key Focus',
              content: 'Resolve client Friday delivery vs internal Monday spec target.',
              priority: 'high',
              sources: [MOCK_SOURCES[1]],
            },
          ],
          sources: [MOCK_SOURCES[1]],
          whyExplanation: 'Generated using Calendar attendees and Gmail thread history.',
        },
      },
    ],
  },
  {
    id: 'conv-latest-proposal',
    title: 'Find my latest proposal',
    updatedAt: '3 days ago',
    messages: [
      {
        id: 'msg-p1',
        sender: 'user',
        text: 'Where is the latest proposal?',
        timestamp: '3 days ago',
      },
      {
        id: 'msg-p2',
        sender: 'ai',
        text: 'Found in Google Drive: Project Alpha Proposal v2.4.',
        timestamp: '3 days ago',
        aiData: {
          id: 'resp-p-1',
          summaryText: 'Project Alpha Proposal v2.4 in Drive.',
          insights: [
            {
              id: 'ins-p1',
              title: 'Proposal File',
              content: 'Project Alpha Proposal v2.4 (Updated Aug 10).',
              priority: 'info',
              sources: [MOCK_SOURCES[2]],
            },
          ],
          sources: [MOCK_SOURCES[2]],
          whyExplanation: 'Identified as the latest revision in Google Drive.',
        },
      },
    ],
  },
];

export const CONTEXT_ENTITIES: ContextEntity[] = [
  {
    id: 'entity-1',
    title: 'Project Alpha',
    type: 'project',
    countText: 'Active workspace focus',
    details: ['1 active thread in Gmail', '1 event in Calendar', '2 files in Drive'],
  },
  {
    id: 'entity-2',
    title: 'Rahul (Client Lead)',
    type: 'person',
    countText: 'Awaiting response',
    details: ['Last emailed Aug 12', 'Participant in tomorrow 10:00 AM sync'],
  },
  {
    id: 'entity-3',
    title: '3 Related Emails',
    type: 'email',
    countText: 'Gmail context',
    details: ['"Project Alpha Spec Update"', '"Deadline confirmation request"', '"Q3 budget notes"'],
  },
  {
    id: 'entity-4',
    title: '1 Meeting Event',
    type: 'event',
    countText: 'Calendar context',
    details: ['Project Alpha Sync (Tomorrow 10:00 AM)'],
  },
  {
    id: 'entity-5',
    title: '2 Documents',
    type: 'doc',
    countText: 'Drive context',
    details: ['Alpha_Launch_Doc_v2.pdf', 'Project_Alpha_Proposal_v2.4.docx'],
  },
];
