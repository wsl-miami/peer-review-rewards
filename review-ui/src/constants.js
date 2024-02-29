const STRING_CONSTANTS = {
    'PROJECT_NAME': 'Miami NFT Journal',
    'HOME': 'Home',
    'AUTHOR_DASHBOARD': 'Author',
    'EDITOR_DASHBOARD': 'Editor',
    'REVIEWER_DASHBOARD': 'Reviewer',
    'SETTINGS_PAGE': 'Reward Settings',
    'REPUTATION_PAGE': 'Reputation',
    'SUBMIT_ACTION': 'Submit Manuscript',
    'WITHDRAW_ACTION': 'Withdraw Manuscript',
    'DECISION_ACTION': 'Submit Decision',
    'TOKENS': 'Accolades',
    'SBT': 'Reputation Tokens',
    'RRT': 'Reward Tokens',
    'RRT_SHORTENED': 'Reward Tokens',
    'STATUS': {
        'ACCEPTED': {'text': 'Accepted', 'value': 1},
        'REJECTED': {'text': 'Rejected', 'value': 2},
        'PENDING': {'text': 'Pending', 'value': 0},
        'WITHDRAWN': {'text': 'Withdrawn', 'value': 3},
        'NEEDS_REVISION': {'text': 'Needs Revision', 'value': 4}
    },
    'DECISION': {
        'ACCEPT': 'Accept',
        'REJECT': 'Reject',
        'REVISE': 'Revise',
        'RESUBMIT': 'Resubmit',
        'WITHDRAW': 'Withdraw'
    }
}

Object.freeze(STRING_CONSTANTS);

export default STRING_CONSTANTS;