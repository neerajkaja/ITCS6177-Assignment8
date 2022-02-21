const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const port = 3000;

const mariadb = require('mariadb');
const pool = mariadb.createPool({
        host : 'localhost',
        user : 'root',
        password: 'root',
        port: 3306,
        connectionLimit:5
});

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const options = {
    swaggerDefinition :{
        info:{
            title: 'Agents API',
            version: '1.1.0',
            description: 'Agent Management System'
        },
        host: '178.128.156.209:3000',
        basePath: '/',
    },
    apis: ['./server2.js'],
}

const specs = swaggerJsdoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * @swagger
 * /agents:
 *     get:
 *       description: Return all prices
 *       produces:
 *          - application/json
 *       responses:
 *          200:
 *              description: Object food containing array of food object with prices
*/
app.get('/agents',(req,resp) =>{
    pool.query('SELECT * from sample.agents')
        .then(res => {
                resp.statusCode = 200;
                resp.setHeader('Content-Type','Application/json');
                resp.send(res);
                })
        .catch(err =>{ 
                resp.statusCode = 404;
                console.error('Error exccuting query', err.stack);
                resp.setHeader('Content-Type','text/plain');
                resp.send('Error executing query' + err.stack);
        });
   
});


/**
 * @swagger
 * /agents:
 *  put:
 *    description: Update agents
 *    consumes: 
 *    - application/json
 *    produces:
 *    - application/json
 *    parameters:
 *    - in: body
 *      name: agentcode
 *      required: true
 *      schema:
 *        type: string
 *        $ref: "#/definitions/AgentPut"
 *    requestBody:
 *      request: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#definitions/AgentPut"
 *    responses: 
 *      200:
 *       description: A successfull response
 * definitions:
 *   AgentPut:
 *     type: object
 *     required:
 *     - agentcode
 *     - agentname
 *     - workingarea
 *     - commission
 *     - phoneNo
 *     - country
 *     properties:
 *       agentcode:
 *         type: string
 *         example: A002
 *       agentname:
 *         type: string
 *         example: Neeraj
 *       workingArea: 
 *         type: string
 *         example: Charlotte
 *       commission:
 *         type: number
 *         example: 4
 *       phoneNo:
 *         type: string
 *         example: 990033445566
 *       country:
 *         type: string
 *         example: United States
*/
app.put('/agents', (req,resp) =>{
    pool.query(`update sample.agents set agent_name = '${req['body'].agentname}',  working_area = '${req['body'].workingarea}', commission  = '${req['body'].commission}', phone_no = '${req['body'].phoneNo}', country = '${req['body'].country}' where agent_code = '${req['body'].agentcode}'`).then(res => {
                console.log(res.affectedRows);
                if(res.affectedRows > 0)
                {
                        resp.statusCode = 200;
                        resp.setHeader('Content-Type','Application/json');
                        resp.send(res);
                }
                else{
                        resp.statusCode = 201;
                        resp.setHeader('Content-Type','text/plain');
                        resp.send("The agent is not located in the table - Operation  unsuccessful");
                }
              })
        .catch(err =>{
                resp.statusCode = 404;
                console.error('Error exccuting query', err.stack);
                resp.setHeader('Content-Type','text/plain');
                resp.send('Error executing query' + err.stack);
        });
});



/**
 * @swagger
 * /agents:
 *  post:
 *    description: New agents
 *    consumes:
 *    - application/json
 *    produces:
 *    - application/json
 *    parameters:
 *    - in: body
 *      name: agentcode
 *      required: true
 *      schema:
 *        type: string
 *        $ref: "#/definitions/agentpost"
 *    requestBody:
 *      request: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#definitions/agentpost"
 *    responses:
 *      200:
 *       description:successfull
 * definitions:
 *   agentpost:
 *     type: object
 *     required:
 *     - agentcode
 *     - agentname
 *     - workingArea
 *     - commission
 *     - phoneNo
 *     - country
 *     properties:
 *       agentcode:
 *         type: string
 *         example: A001
 *       agentname:
 *         type: string
 *         example: Neeraj
 *       workingArea:
 *         type: string
 *         example: Charlotte
 *       commission:
 *         type: number
 *         example: 11
 *       phoneNo:
 *         type: string
 *         example: 9988998899
 *       country:
 *         type: string
 *         example: United States
*/
app.post('/agents',(req,resp) =>{
    pool.query(`insert into sample.agents values ('${req['body'].agentcode}', '${req['body'].agentname}', '${req['body'].workingArea}', '${req['body'].commission}', '${req['body'].phoneNo}', '${req['body'].country}')`).then(res => {
               console.log(res);
                 if(res.affectedRows > 0){
                        resp.statusCode = 200;
                        resp.setHeader('Content-Type','Application/json');
                        resp.send(res);
                }else{
                        resp.statusCode = 201;
                        resp.setHeader('Content-Type','text/plain');
                        resp.send('No rows added -Operation unsuccessful');
                }
               })
        .catch(err =>{
                resp.statusCode = 404;
                console.error('Error exccuting query', err.stack);
                resp.setHeader('Content-Type','text/plain');
                resp.send('Error executing query' + err.stack);
        });
});

/**
 * @swagger
 * /agents:
 *  delete:
 *    description: Removes product
 *    consumes: 
 *    - application/json
 *    produces:
 *    - application/json
 *    parameters:
 *    - in: body
 *      name: name
 *      required: true
 *      schema:
 *        type: string
 *        $ref: "#/definitions/agentdel"
 *    responses: 
 *      200:
 *       description: A successfull response
 * definitions:
 *   agentdel:
 *     type: object
 *     required:
 *     - agentcode
 *     properties:
 *       agentcode:
 *         type: string
 *         example: 'A199'
*/
app.delete('/agents',(req,resp) =>{
    pool.query(`delete from sample.agents where agent_code =  ('${req['body'].agentcode}')`).then(res => {
               console.log(res);
                 if(res.affectedRows > 0){
                        resp.statusCode = 200;
                        resp.setHeader('Content-Type','Application/json');
                        resp.send(res);
                }else{
                        resp.statusCode = 201;
                        resp.setHeader('Content-Type','text/plain');
                        resp.send('No rows delete - operation unsuccessful');
                }
               })
        .catch(err =>{
                resp.statusCode = 404;
                console.error('Error exccuting query', err.stack);
                resp.setHeader('Content-Type','text/plain');
                resp.send('Error executing query' + err.stack);
        });
});

/**
 * @swagger
 * /agents:
 *  patch:
 *    description: updates or inserts agents
 *    consumes:
 *    - application/json
 *    produces:
 *    - application/json
 *    parameters:
 *    - in: body
 *      name: agentcode
 *      required: true
 *      schema:
 *        type: string
 *        $ref: "#/definitions/agentpatch"
 *    requestBody:
 *      request: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: "#definitions/agentpatch"
 *    responses:
 *      200:
 *       description: successfull response
 * definitions:
 *   agentpatch:
 *     type: object
 *     required:
 *     - agentcode
 *     - agentname
 *     - workingArea
 *     - commission
 *     - phoneNo
 *     - country
 *     properties:
 *       agentcode:
 *         type: string
 *         example: A123
 *       agentname:
 *         type: string
 *         example: Neeraj
 *       workingArea:
 *         type: string
 *         example: Charlotte
 *       commission:
 *         type: number
 *         example: 4
 *       phoneNo:
 *         type: string
 *         example: 998899889988
 *       country:
 *         type: string
 *         example: United States
*/
app.patch('/agents',(req,resp) =>{
    pool.query(`update sample.agents set agent_name = '${req['body'].agentname}',  working_area = '${req['body'].workingArea}', commission  = '${req['body'].commission}', phone_no = '${req['body'].phoneNo}', country = '${req['body'].country}' where agent_code = '${req['body'].agentcode}'`).then(res => {
                console.log(res.affectedRows);
                if(res.affectedRows > 0)
                {
                        resp.statusCode = 200;
                        resp.setHeader('Content-Type','Application/json');
                        resp.send(res);
                }
                else{
                    pool.query(`insert into sample.agents values('${req['body'].agentcode}', '${req['body'].agentname}', '${req['body'].workingArea}', '${req['body'].commission}', '${req['body'].phoneNo}', '${req['body'].country}')`).then(res1 => {
                        if(res1.affectedRows > 0)
                        {
                            resp.statusCode = 200;                 
                            resp.setHeader('Content-Type','Application/json');
                            resp.send(res1);
                        }
                        else{
                            resp.statusCode = 201;
                            resp.setHeader('Content-Type','text/plain');
                            resp.send("The agent is not located in the table - Operation  unsuccessful");
                        }
                    })
                    .catch(err =>{
                        resp.statusCode = 404;
                        console.error('Error exccuting query', err.stack);
                        resp.setHeader('Content-Type','text/plain');
                        resp.send('Error executing query' + err.stack);
                    });
                }
              })
        .catch(err =>{
                resp.statusCode = 404;
                console.error('Error exccuting query', err.stack);
                resp.setHeader('Content-Type','text/plain');
                resp.send('Error executing query' + err.stack);
        });
});


app.listen(port, ()=>{
    console.log(`API server is at ${port}`);
});
