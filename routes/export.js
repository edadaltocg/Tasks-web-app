const express = require('express');

const Project = require('../models/projectModel');
const Task = require('../models/taskModel');
const Journal = require('../models/journalModel');

const fs = require('fs');

const router = express.Router();

var exportMethods = require('../public/javascripts/exportMethods');

router.get('/',async (req,res) => {

    req.session.zipContent = [];
    var formats = [
        {_id:'csvFile',name:'CSV'},
        {_id:'xmlFile',name:'XML'},
        {_id:'jsonFile',name:'JSON'},
        {_id:'excelFile',name:'MS EXCEL'}
        ];

    res.render('exportForm',{choices:formats,object:'dataFormat',firstName: req.session.firstname, lastName: req.session.name});

});

router.post('/dataFormat',async (req,res) => {

    var formatsArray = Object.keys(req.body);
    req.session.dataFormatExport = formatsArray;
    var filterQuery = {};
    var projectsData;
    if (req.session.role !== "admin") {
        filterQuery = {members:req.session.userId};
    }

    projectsData = await Project.find(filterQuery)
        .catch((mongoError) => res.render('error', {error: mongoError}));
    res.render('exportForm',{choices:projectsData,object:'projects',firstName: req.session.firstname, lastName: req.session.name});

});

router.post('/tasks',async (req,res) => {
    /*export all the tasks assigned to him*/
    console.log(req.session.dataFormatExport);
    switch (req.session.dataFormatExport[0]) {
        case 'csvFile':
            await exportMethods.exportTasksCSV(req,res);
            break;
        default:
            res.redirect('/projects');
            return ;
    }

    console.log("----------compress---------");
    console.log(req.session.zipContent);
    res.zip({files:req.session.zipContent, filename:'myfile.zip'});
    console.log("----------fini---------");
});

/*export all the projects he participates*/
router.post('/projects',async (req,res) => {

    var filterQuery = {project:Object.keys(req.body)};
    var tasksData;
    await exportMethods.exportProjectsCSV(req,res);
    if (req.session.role !== "admin") {
        filterQuery.assignee = req.session.userId;
    }
    tasksData = await Task.find(filterQuery)
        .catch((mongoError) => res.render('error',{error:mongoError}));
    res.render('exportForm',{choices:tasksData,object:'tasks',firstName: req.session.firstname, lastName: req.session.name});
});

module.exports = router;