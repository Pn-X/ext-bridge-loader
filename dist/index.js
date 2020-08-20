let loader = require('loader-utils');
let esprima = require('esprima');
let escodegen = require('escodegen');
let estraverse = require('estraverse');

module.exports = function (content) {
    const options = loader.getOptions(this);
    let names = options.names;
    if (names.length <= 0) {
        names = ['ext'];
    }
    let ast = esprima.parseModule(content);
    let result = estraverse.replace(ast, {
        enter: function (node) {
            if (node.type == esprima.Syntax.CallExpression && 
                node.callee.type == esprima.Syntax.MemberExpression && 
                node.callee.object.type == esprima.Syntax.MemberExpression && 
                node.callee.object.object.type == esprima.Syntax.Identifier && 
                names.indexOf(node.callee.object.object.name) > -1) {
                var args;
                var newnode;
                for (let index = 0; index < node.arguments.length; index++) {
                    const element = node.arguments[index];
                    var code = escodegen.generate(element);
                    if (args != undefined) {
                        args = args+','+code;
                    } else {
                        args = code;
                    }
                }
                let newCode = node.callee.object.object.name + ".invoke('"+ node.callee.object.property.name + "','" + node.callee.property.name + "'," + args + ")";
                let newAst = esprima.parse(newCode);
                estraverse.traverse(newAst,{
                    enter: function (newAstNode) {
                        if (newAstNode.type == esprima.Syntax.CallExpression && 
                            newAstNode.callee.type == esprima.Syntax.MemberExpression && 
                            newAstNode.callee.object.type == esprima.Syntax.Identifier && 
                            newAstNode.callee.property.type == esprima.Syntax.Identifier && 
                            newAstNode.callee.property.name == 'invoke' && 
                            names.indexOf(newAstNode.callee.object.name) > -1) {
                            newnode = newAstNode;
                            this.break();
                        }
                    }
                });
                return newnode;
            }
        },
    });
    return escodegen.generate(result);
};