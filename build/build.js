const fs = require('fs')
const jade = require('jade');
const parseMD = require('parse-md');
const path = require('path');
const marked = require('marked');

function render(filename) {
    const fileContents = fs.readFileSync('../app/contents/'+filename, 'utf8');
    const { metadata, content } = parseMD.default(fileContents);
    var renderFunction = jade.compileFile('../app/templates/' + metadata.template, options.jade)
    var renderedMarkdown = marked(content);
    page = { metadata: metadata, title: metadata.title, html: renderedMarkdown };
    var html = renderFunction(options.locals);
    fs.writeFileSync('../' + path.basename(filename, '.md') + '.html', html)
}

// Read the Jade options
var optionsData = fs.readFileSync('../app/config.json')
let options = JSON.parse(optionsData)
options.jade.globals = ["page"];

for (var metadataFilename of fs.readdirSync('../app/contents')) {
    if (metadataFilename.endsWith('.md')) {
        render(metadataFilename);
    }
}
