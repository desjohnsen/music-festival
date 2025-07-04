const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  const SPACE_ID = process.env.SPACE_ID;
  const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

  const url = `https://cdn.contentful.com/spaces/${SPACE_ID}/entries?access_token=${ACCESS_TOKEN}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
