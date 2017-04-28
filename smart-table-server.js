var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(express.static('./public'));

app.post('/api/users',(request,response) => {
    var startPage = request.body.startPage;
    var endPage = request.body.endPage;
    if(!startPage && !endPage){
        response.send(data[0]);
    }else{
        if(startPage===1 && endPage===4){
            response.send(data[0]);
        }else if(startPage===5 && endPage===5){
            response.send(data[1]);
        }else if(startPage===9 && endPage===12){
            response.send(data[2]);
        }else if(startPage===13 && endPage===13){
            response.send(data[3]);
        }else{
            console.log(startPage,endPage);
        }
    }
});

var ipaddress = '127.0.0.1';
var port = 10000;
app.listen(port, ipaddress, function() {
    console.log('listening at : http://'+ipaddress+':'+port);
});

var data = [
    {
        "resultSet":[
            {"id":1,"name":"","skill":"Skill1","info1":null,"info2":"1","isRush":0,"docCategory":1,"isPolicy":true,"isNonPolicy":false,"isOthers":false,"isDmsOnly":true,"isEpicOnly":false},
            {"id":2,"name":"2","skill":null,"info1":"2","info2":"","isRush":0,"docCategory":2,"isPolicy":false,"isNonPolicy":true,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":3,"name":null,"skill":"3","info1":"3","info2":"3","isRush":1,"docCategory":3,"isPolicy":false,"isNonPolicy":false,"isOthers":true,"isDmsOnly":false,"isEpicOnly":true},
            {"id":4,"name":"Name4","skill":"4","info1":"4","info2":"4","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":5,"name":"Namenamenamenamenamenamenamename5","skill":"Skill5","info1":"5","info2":"5","isRush":1,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":true,"isEpicOnly":false},
            {"id":6,"name":"6","skill":"6","info1":"6","info2":"6","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":7,"name":"7","skill":"7","info1":"7","info2":"7","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":8,"name":"8","skill":"8","info1":"8","info2":"8","isRush":1,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":9,"name":"9","skill":"9","info1":"9","info2":"9","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":10,"name":"10","skill":"10","info1":"10","info2":"10","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":11,"name":"11","skill":"11","info1":"11","info2":"11","isRush":1,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":12,"name":"12","skill":"12","info1":"12","info2":"12","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":13,"name":"13","skill":"13","info1":"13","info2":"13","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":14,"name":"14","skill":"14","info1":"14","info2":"14","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":15,"name":"15","skill":"15","info1":"15","info2":"15","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":16,"name":"16","skill":"16","info1":"16","info2":"16","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":17,"name":"17","skill":"17","info1":"17","info2":"17","isRush":1,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":18,"name":"18","skill":"18","info1":"18","info2":"18","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":19,"name":"19","skill":"19","info1":"19","info2":"19","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":20,"name":"20","skill":"20","info1":"20","info2":"20","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":21,"name":"21","skill":"21","info1":"21","info2":"21","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":22,"name":"22","skill":"22","info1":"22","info2":"22","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":23,"name":"23","skill":"23","info1":"23","info2":"23","isRush":1,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":24,"name":"24","skill":"24","info1":"24","info2":"24","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":25,"name":"25","skill":"25","info1":"25","info2":"25","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":26,"name":"26","skill":"26","info1":"26","info2":"26","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":27,"name":"27","skill":"27","info1":"27","info2":"27","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":28,"name":"28","skill":"28","info1":"28","info2":"28","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":29,"name":"29","skill":"29","info1":"29","info2":"29","isRush":1,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":30,"name":"30","skill":"30","info1":"30","info2":"30","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":31,"name":"31","skill":"31","info1":"31","info2":"31","isRush":1,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":32,"name":"32","skill":"32","info1":"32","info2":"32","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":33,"name":"33","skill":"33","info1":"33","info2":"33","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":34,"name":"34","skill":"34","info1":"34","info2":"34","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":35,"name":"35","skill":"35","info1":"35","info2":"35","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":36,"name":"36","skill":"36","info1":"36","info2":"36","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":37,"name":"37","skill":"37","info1":"37","info2":"37","isRush":1,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":38,"name":"38","skill":"38","info1":"38","info2":"38","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":39,"name":"39","skill":"39","info1":"39","info2":"39","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":40,"name":"40","skill":"40","info1":"40","info2":"40","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":41,"name":"41","skill":"41","info1":"41","info2":"41","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":42,"name":"42","skill":"42","info1":"42","info2":"42","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":43,"name":"43","skill":"43","info1":"43","info2":"43","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":44,"name":"44","skill":"44","info1":"44","info2":"44","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":45,"name":"45","skill":"45","info1":"45","info2":"45","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":46,"name":"46","skill":"46","info1":"46","info2":"46","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":47,"name":"47","skill":"47","info1":"47","info2":"47","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":48,"name":"48","skill":"48","info1":"48","info2":"48","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":49,"name":"49","skill":"49","info1":"49","info2":"49","isRush":1,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":50,"name":"50","skill":"50","info1":"50","info2":"50","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":51,"name":"51","skill":"51","info1":"51","info2":"51","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":52,"name":"52","skill":"52","info1":"52","info2":"52","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":53,"name":"53","skill":"53","info1":"53","info2":"53","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":54,"name":"54","skill":"54","info1":"54","info2":"54","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":55,"name":"55","skill":"55","info1":"55","info2":"55","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":56,"name":"56","skill":"56","info1":"56","info2":"56","isRush":1,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":57,"name":"57","skill":"57","info1":"57","info2":"57","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":58,"name":"58","skill":"58","info1":"58","info2":"58","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":59,"name":"59","skill":"59","info1":"59","info2":"59","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":60,"name":"60","skill":"60","info1":"60","info2":"60","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":61,"name":"51","skill":"51","info1":"51","info2":"51","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":62,"name":"52","skill":"52","info1":"52","info2":"52","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":63,"name":"53","skill":"53","info1":"53","info2":"53","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":64,"name":"54","skill":"54","info1":"54","info2":"54","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":65,"name":"55","skill":"55","info1":"55","info2":"55","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":66,"name":"56","skill":"56","info1":"56","info2":"56","isRush":1,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":67,"name":"57","skill":"57","info1":"57","info2":"57","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":68,"name":"58","skill":"58","info1":"58","info2":"58","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":69,"name":"59","skill":"59","info1":"59","info2":"59","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":70,"name":"60","skill":"60","info1":"60","info2":"60","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":71,"name":"51","skill":"51","info1":"51","info2":"51","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":72,"name":"52","skill":"52","info1":"52","info2":"52","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":73,"name":"53","skill":"53","info1":"53","info2":"53","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":74,"name":"54","skill":"54","info1":"54","info2":"54","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":75,"name":"55","skill":"55","info1":"55","info2":"55","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":76,"name":"56","skill":"56","info1":"56","info2":"56","isRush":1,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":77,"name":"57","skill":"57","info1":"57","info2":"57","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":78,"name":"58","skill":"58","info1":"58","info2":"58","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":79,"name":"59","skill":"59","info1":"59","info2":"59","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":80,"name":"60","skill":"60","info1":"60","info2":"60","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":81,"name":"51","skill":"51","info1":"51","info2":"51","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":82,"name":"52","skill":"52","info1":"52","info2":"52","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":83,"name":"53","skill":"53","info1":"53","info2":"53","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":84,"name":"54","skill":"54","info1":"54","info2":"54","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":85,"name":"55","skill":"55","info1":"55","info2":"55","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":86,"name":"56","skill":"56","info1":"56","info2":"56","isRush":1,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":87,"name":"57","skill":"57","info1":"57","info2":"57","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":88,"name":"58","skill":"58","info1":"58","info2":"58","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":89,"name":"59","skill":"59","info1":"59","info2":"59","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":90,"name":"60","skill":"60","info1":"60","info2":"60","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":91,"name":"51","skill":"51","info1":"51","info2":"51","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":92,"name":"52","skill":"52","info1":"52","info2":"52","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":93,"name":"53","skill":"53","info1":"53","info2":"53","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":94,"name":"54","skill":"54","info1":"54","info2":"54","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":95,"name":"55","skill":"55","info1":"55","info2":"55","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":96,"name":"56","skill":"56","info1":"56","info2":"56","isRush":1,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":97,"name":"57","skill":"57","info1":"57","info2":"57","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":98,"name":"58","skill":"58","info1":"58","info2":"58","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":99,"name":"59","skill":"59","info1":"59","info2":"59","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":100,"name":"60","skill":"60","info1":"60","info2":"60","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false}
        ],
        "totalItems":110
    },
    {
        "resultSet":[
            {"id":101,"name":"51","skill":"51","info1":"51","info2":"51","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":102,"name":"52","skill":"52","info1":"52","info2":"52","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":103,"name":"53","skill":"53","info1":"53","info2":"53","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":104,"name":"54","skill":"54","info1":"54","info2":"54","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":105,"name":"55","skill":"55","info1":"55","info2":"55","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":106,"name":"56","skill":"56","info1":"56","info2":"56","isRush":1,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":107,"name":"57","skill":"57","info1":"57","info2":"57","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":108,"name":"58","skill":"58","info1":"58","info2":"58","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":109,"name":"59","skill":"59","info1":"59","info2":"59","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":110,"name":"60","skill":"60","info1":"60","info2":"60","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false}
        ],
        "totalItems":110
    },
    {
        "resultSet":[
            {"id":41,"name":"41","skill":"41","info1":"41","info2":"41","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":42,"name":"42","skill":"42","info1":"42","info2":"42","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":43,"name":"43","skill":"43","info1":"43","info2":"43","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":44,"name":"44","skill":"44","info1":"44","info2":"44","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":45,"name":"45","skill":"45","info1":"45","info2":"45","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":46,"name":"46","skill":"46","info1":"46","info2":"46","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":47,"name":"47","skill":"47","info1":"47","info2":"47","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":48,"name":"48","skill":"48","info1":"48","info2":"48","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":49,"name":"49","skill":"49","info1":"49","info2":"49","isRush":1,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":50,"name":"50","skill":"50","info1":"50","info2":"50","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":51,"name":"51","skill":"51","info1":"51","info2":"51","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":52,"name":"52","skill":"52","info1":"52","info2":"52","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":53,"name":"53","skill":"53","info1":"53","info2":"53","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":54,"name":"54","skill":"54","info1":"54","info2":"54","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":55,"name":"55","skill":"55","info1":"55","info2":"55","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":56,"name":"56","skill":"56","info1":"56","info2":"56","isRush":1,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":57,"name":"57","skill":"57","info1":"57","info2":"57","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":58,"name":"58","skill":"58","info1":"58","info2":"58","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":59,"name":"59","skill":"59","info1":"59","info2":"59","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":60,"name":"60","skill":"60","info1":"60","info2":"60","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false}
        ],
        "totalItems":62
    },
    {
        "resultSet":[
            {"id":61,"name":"61","skill":"61","info1":"61","info2":"61","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false},
            {"id":62,"name":"62","skill":"62","info1":"62","info2":"62","isRush":0,"docCategory":0,"isPolicy":false,"isNonPolicy":false,"isOthers":false,"isDmsOnly":false,"isEpicOnly":false}
        ],
        "totalItems":62
    }
];