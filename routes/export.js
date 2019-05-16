const express = require('express');
const Project = require('../models/projectModel');
const Task = require('../models/taskModel');
const router = express.Router();
var exportMethods = require('../public/javascripts/exportMethods');

/*Get page where the possible file formats are proposed*/
router.get('/',async (req,res) => {

    req.session.zipContent = []; //initialize zipContent for storing the content to be sent
    req.session.exportProjects = []; //initialize exportProjects for storing the projects to be exported
    var formats = [
        {_id:'csvFile',name:'  CSV'},
        {_id:'xmlFile',name:'  XML'},
        {_id:'jsonFile',name:'JSON'},
        ]; // three formats provided

    res.render('exportForm',{choices:formats,title:'dataFormat',aim:'projects',firstName: req.session.firstname, lastName: req.session.name});

});

/*POST lists all the available projects to be exported*/
router.post('/projects',async (req,res) => {

    var formatsArray = Object.keys(req.body);//the formats chosen by user
    req.session.dataFormatExport = formatsArray;//store the formats in the session
    var filterQuery = {};
    var projectsData;
    if (req.session.role !== "admin") {
        filterQuery = {members:req.session.userId};
    } // if the user is not admin, he will only see the projects he participated
    projectsData = await Project.find(filterQuery)
        .catch((mongoError) => res.render('error', {error: mongoError}));
    res.render('exportForm',{choices:projectsData,title:'projects',aim:'tasks',firstName: req.session.firstname, lastName: req.session.name});

});


/*POST lists all the tasks belonging to the projects chosen bu the user*/
router.post('/tasks',async (req,res) => {

    var filterQuery = {project:Object.keys(req.body)};//the projects chosen by the user
    req.session.exportProjects = Object.keys(req.body); // store the projects in the session
    var tasksData;
    for (var i = 0;i<req.session.dataFormatExport.length;i++) {

        switch (req.session.dataFormatExport[i]) {
            case 'csvFile':
                await exportMethods.exportProjectsCSV(req,res);
                break;
            default:
                break;
        }
    }// if CSV is chosen, the files concerning basic information of projects will be firstly exported
    if (req.session.role !== "admin") {
        filterQuery.assignee = req.session.userId;
    }// if the user is not admin, he will only see the tasks assigned to him
    tasksData = await Task.find(filterQuery)
        .catch((mongoError) => res.render('error',{error:mongoError}));
    res.render('exportForm',{choices:tasksData,title:'tasks',aim:'download',firstName: req.session.firstname, lastName: req.session.name});
});

/*POST send a zip file containing the files demanded*/
router.post('/download',async (req,res) => {

    for (var i = 0;i<req.session.dataFormatExport.length;i++) {

        switch (req.session.dataFormatExport[i]) {
            case 'csvFile':
                await exportMethods.exportTasksCSV(req,res);
                break;
            case 'xmlFile':
                await exportMethods.exportXML(req,res);
                break;
            case 'jsonFile':
                await exportMethods.exportJSON(req,res);
                break;
            default:
                res.redirect('/projects');
                return ;
        }
    }//for each selected format, export the data in the corresponding files


    console.log("----------compress---------");
    res.zip({files:req.session.zipContent, filename:'myfile.zip'});//put all the files in a zip file and send it
    req.session.zipContent = [];
    console.log("----------fini---------");
});

module.exports = router;