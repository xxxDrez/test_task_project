import HttpServer from "../HttpServer/HttpServer.js"

export default function validateRequest(schemaBody = {}, schemaQuery = {}){
    return function(request,response){
        try {
            for(const key in schemaBody){
                if(!request.body.hasOwnProperty(key)){
                    HttpServer.sendResponse(response, 400, {
                        error: `Missing '${key}' in request body`
                    });
                    throw `Missing '${key}' in request body`;
                } else {
                    if(typeof request.body[key] !== typeof schemaBody[key]){
                        HttpServer.sendResponse(response, 400, {
                            error: `The parameter '${key}' in body type is incorrect`
                        });
                        throw `The parameter '${key}' in body type is incorrect`;
                    }
                }
            }

            for(const key in schemaQuery){
                if(!request.query.hasOwnProperty(key)){
                    HttpServer.sendResponse(response, 400, {
                        error: `Missing '${key}' in query parameters`
                    });
                    throw `Missing '${key}' in query parameters`;
                }/* else {
                    if(typeof request.query[key] !== typeof schemaQuery[key]){
                        HttpServer.sendResponse(response, 400, {
                            error: `The parameter '${key}' in query type is incorrect`
                        });
                        throw `The parameter '${key}' in query type is incorrect`;
                    }
                }*/
            }
        } catch (e) {
            console.log(e);
            HttpServer.sendResponse(response, 500, {
                error: 'Internal server error'
            });
        }
    }
}