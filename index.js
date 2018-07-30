const AWS = require('aws-sdk');

function prepare_response(res) {
    const body = { 'text': res };
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
        },
        'body': JSON.stringify(body)
    }; 
}

function get_slackparams(event) {
    const body = decodeURIComponent(event.body);
    const params = {};
    body.split('&').forEach(
        (element) => {
            const list = element.split('=');
            params[list[0]] = list[1];
        });
    return params;
}

exports.handler = (event, context, callback) => {
    const params = get_slackparams(event);
    const RESPONSE_URL = 'response_url';
    
    const lambda = new AWS.Lambda();
    const lambda_params = {
        FunctionName: 'quote',
        InvocationType: 'Event', // Ensures asynchronous execution
        Payload: JSON.stringify({
            response_url: params[RESPONSE_URL]
        })
    };
    
    const instant_reply = 'Sure! Just a moment!';
    return lambda.invoke(lambda_params).promise() // Returns 200 immediately after invoking the second lambda, not waiting for the result
    .then(() => callback(null, prepare_response(instant_reply)));
};
