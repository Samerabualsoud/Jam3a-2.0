// This file is for server-side dependencies only
// It should not be imported in client-side code

const nodemailer = require('nodemailer');
const express = require('express');
const cors = require('cors');

module.exports = {
  nodemailer,
  express,
  cors
};
