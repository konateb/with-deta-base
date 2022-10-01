import { Deta } from "deta";

const deta = Deta(process.env.DETA_PROJECT_KEY);

const base = deta.Base("todos");
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}
const handler = async (req, res) => {
  let { body, method } = req;
  let respBody = {};

  if (method === "GET") {
    const { items } = await base.fetch();
    respBody = items;
    res.statusCode = 200;
  } else if (method === "POST") {
    body = JSON.parse(body);
    body.isCompleted = false;
    body;
    respBody = await base.put(body, `temp_key ${makeid(6)}`, { expireIn: 2000 });
    res.statusCode = 201;
  }

  res.json(respBody);
};

export default handler;
