'use strict';

const debug = require('debug')('restServ:table-router');
const createError = require('http-errors');
const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const Table = require('../model/table.js');
const Employee = require('../model/employee.js');

const tableRouter = module.exports = Router();

tableRouter.post('/api/table', bearerAuth, jsonParser, function(req, res, next){
  debug('POST /api/table');

  if(!req.body.tableNum) return next(createError(400, 'expected table number'));

  return new Table(req.body).save()
  .then(table => res.json(table))
  .catch(next);
});

tableRouter.get('/api/table/:id', bearerAuth, function(req, res, next){
  debug('GET /api/table/:id');

  return Table.findById(req.params.id)
  .then(table => res.json(table))
  .catch(next);
});

tableRouter.put('/api/table/:id', bearerAuth, jsonParser, function(req, res, next){
  debug('PUT /api/table/:id');

  if(!req.body.tableNum) return next(createError(400, 'expected table number'));
  return Table.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then(table => res.json(table))
  .catch(next);
});

tableRouter.put('/api/employee/:employeeId/addTable/:tableId', bearerAuth, function(req, res, next){
  debug('PUT /api/employee/:employeeId/addTable/:tableId');

  return Table.findById(req.params.tableId)
  .then(table => {
    return Employee.findByIdAndAddTable(req.params.employeeId, table._id);
  })
  .then(employee => res.json(employee))
  .catch(next);
});

tableRouter.put('/api/employee/:employeeId/removeTable/:tableId', bearerAuth, function(req, res, next){
  debug('PUT /api/employee/:employeeId/removeTable/:tableId');

  return Table.findById(req.params.tableId)
  .then(table => {
    return Employee.findByIdAndRemoveTable(req.params.employeeId, table._id);
  })
  .then(employee => res.json(employee))
  .catch(next);
});

tableRouter.delete('/api/employee/:employeeId/table/:tableId', bearerAuth, function(req, res, next){
  debug('DELETE /api/table/:id');

  Employee.findByIdAndRemoveTable(req.params.employeeId, req.params.tableId);

  Table.findByIdAndRemove(req.params.tableId)
  .then(() => res.sendStatus(204))
  .catch(next);
});