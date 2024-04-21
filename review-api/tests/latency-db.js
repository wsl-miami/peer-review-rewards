// rquests_min, requests_max, requests_mean all represent the number of requests made per second (handled by API (throughput)).
const autocannon = require('autocannon');

// Configuration for each API endpoint
const apiEndpoints = [
    { method: 'POST', path: '/api/manuscript-submission', headers: {'content-type': 'application/json'}, body: JSON.stringify({author: '0x01fD07f75146Dd40eCec574e8f39A9dBc65088e6', file_hash: 'QmaKDZeqsM6DpxRU5v1W1RaK8Xjm2Ea7Zi8W52RAxAtcVb', journal: '0xcc5e48A23A7Db6FFda9facc76Db4A2aB5a89c80A'}) },
    { method: 'GET', path: '/api/get-assigned-reviewers', query: '{"article_hash": "QmNcytemo8oJi2TpaSXtKmBauHZ6E34L9VMrx3cikRJ7m4"}' },
    { method: 'POST', path: '/api/add-reviewers', headers: {'content-type': 'application/json'}, body: JSON.stringify({"article_hash": "QmWXEA5j7XEwBCAq11hXozvmBWji66V4v81TA44bexQz7q", "reviewer_hashes": ["0x9ae658c7300849D0A8E61d7098848750afDA88eF", "0x93Ca3d98200a35ba6a7d703188C200b000B9FDb7"], "deadline": "2024-05-08"})},
    { method: 'GET', path: '/api/get-manuscripts-by-author', query: '{"author_hash": "0x01fD07f75146Dd40eCec574e8f39A9dBc65088e6"}' },
    { method: 'GET', path: '/api/get-manuscripts-by-reviewer', query: '{"reviewer_hash": "0x93Ca3d98200a35ba6a7d703188C200b000B9FDb7"}' },
    { method: 'POST', path: '/api/review-submission', headers: {'content-type': 'application/json'}, body: JSON.stringify({reviewer: '0x9ae658c7300849D0A8E61d7098848750afDA88eF', prev_review_links: [], review: 'QmarD7bwhn5f9ykcHEyjM8GJSDqax7eCRGSoo1cpa4cSvu', journal: '0xcc5e48A23A7Db6FFda9facc76Db4A2aB5a89c80A', article: 'QmRyJJMSWnhUS7BSQi99TgLfyDYEJxMy84wy7tBziKh6sk'}) },
    { method: 'GET', path: '/api/get-manuscripts-by-journal', query: '{"journal_hash": "0xcc5e48A23A7Db6FFda9facc76Db4A2aB5a89c80A"}' },
    // { method: 'GET', path: '/api/get-unassigned-reviews', body: '{"journal_hash": "This is a test review"}' }, // NOT IN USE
    { method: 'GET', path: '/api/get-token-settings', query: '{"journal_hash": "0xcc5e48A23A7Db6FFda9facc76Db4A2aB5a89c80A"}' },
    // { method: 'POST', path: '/api/bulk-update-assigned-reviews', body: '{"journal_hash": "This is a test review"}' }, // NOT IN USE
    // { method: 'POST', path: '/api/update-assigned-reviews', body: '{"journal_hash": "This is a test review"}' }, // NOT IN USE
    { method: 'POST', path: '/api/update-review-settings', headers: {'content-type': 'application/json'}, body: JSON.stringify({"journal_hash": "0xcc5e48A23A7Db6FFda9facc76Db4A2aB5a89c80A", "enableRRT": "1", "amountPerReviewWithinDeadline": "10", "amountPerReviewAfterDeadline": "5"}) },
    { method: 'GET', path: '/api/get-journals' },
    { method: 'GET', path: '/api/get-reviewers' },
    { method: 'GET', path: '/api/get-journal-detail', query: '{"journal_hash": "0xcc5e48A23A7Db6FFda9facc76Db4A2aB5a89c80A"}'},
    { method: 'POST', path: '/api/update-decision-status', headers: {'content-type': 'application/json'}, body: JSON.stringify({"decision_status": "3", "manuscript_hash": "QmaNxbQNrJdLzzd8CKRutBjMZ6GXRjvuPepLuNSsfdeJRJ"}) },
    { method: 'GET', path: '/api/get-profile', query: '{"account_hash": "0xcc5e48A23A7Db6FFda9facc76Db4A2aB5a89c80A"}' },
    // { method: 'POST', path: '/api/create-user-profile', body: '{"journal_hash": "This is a test review"}' },

];


// @TODO: File upload using Pinata IPFS

// Function to run Autocannon test for each API endpoint
async function runTest(endpoint) {
    return new Promise((resolve, reject) => {
        const instance = autocannon({
            ...endpoint,
            url: `http://localhost:5000${endpoint.path}`,
            connections: 50,
            duration: 10, // Duration of the test in seconds
            pipelining: 1,
            workers: 1,
            maxConnectionRequests: 1,
        }, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });

        // Handle errors
        instance.on('error', reject);
    });
}

// Run tests for each API endpoint and collect results
async function runTests() {
    const aggregatedResults = [];

    for (const endpoint of apiEndpoints) {
        try {
            console.log(`Testing ${endpoint.method} ${endpoint.path}...`);
            const result = await runTest(endpoint);
            // console.log('error', result.errors);
            console.log('statusCodeStats', result.statusCodeStats);
            const statusCodeStats = result.statusCodeStats;
            const status2xx = statusCodeStats['200']?.count || 0;

            aggregatedResults.push({
                method: endpoint.method,
                path: endpoint.path,
                latency_mean: result.latency.mean,
                latency_first_quartile: result.latency.p25,
                latency_median: result.latency.p50,
                latency_third_quartile: result.latency.p75,
                latency_min: result.latency.min,
                latency_max: result.latency.max,
                latency_stddev: result.latency.stddev,
                // requests_mean: result.requests.mean,
                // requests_min: result.requests.min,
                // requests_max:  result.requests.max,
                totalRequests: result.latency.totalCount,
                status_2xx: status2xx,
                // throughput_min: result.throughput.min,
                // throughput_max: result.throughput.max,
                // throughput_mean: result.throughput.mean,
            });
        } catch (error) {
            console.error(`Error testing ${endpoint.method} ${endpoint.path}:`, error);
        }
    }

    // Display aggregated results in a table
    console.table(aggregatedResults);
}

// Start running tests
runTests();
