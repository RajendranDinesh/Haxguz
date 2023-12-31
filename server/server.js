const express = require('express');
const app = express();
const cors = require('cors');

const userRouter = require('./routes/users');
const organisationRouter = require('./routes/organisation');
const eventRouter = require('./routes/events');
const ticketRouter = require('./routes/ticket');
const paymentRouter = require('./services/paymentService');
const certificateRouter = require('./routes/certificate');
const notificationsRouter = require('./routes/notifications');
const teamsRouter = require('./routes/teams');
const adminRouter = require('./routes/admin');
require('dotenv').config();

app.use(cors({
    credentials: true,
    origin: ['https://ems-two-orcin.vercel.app',process.env.CLIENT_URL]
}));
app.use(express.json());

const port = process.env.PORT || 5000;

app.use(userRouter);
app.use(eventRouter);
app.use(organisationRouter);
app.use(ticketRouter);
app.use(paymentRouter);
app.use(certificateRouter);
app.use(notificationsRouter);
app.use(teamsRouter);
app.use(adminRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});