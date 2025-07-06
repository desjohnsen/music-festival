const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  const SPACE_ID = process.env.SPACE_ID;
  const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

  const url = `https://cdn.contentful.com/spaces/${SPACE_ID}/entries?access_token=${ACCESS_TOKEN}&content_type=artist&include=2`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.includes || !data.includes.Entry) {
      data.includes = { Entry: [] };
    }

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
