const { expressMiddleware, expressRequestIdMiddleware } = require('express-wolox-logger'),
  express = require('express'),
  bodyParser = require('body-parser'),
  path = require('path'),
  config = require('./config'),
  routes = require('./app/routes'),
  errors = require('./app/middlewares/errors'),
  paginate = require('express-paginate'),
  cors = require('cors'),
  swaggerUi = require('swagger-ui-express'),
  swaggerDocument = require('./swagger.json'),
  {
    DEFAULT_BODY_SIZE_LIMIT,
    DEFAULT_PARAMETER_LIMIT,
    PAGINATE_LIMIT,
    PAGINATE_MAX_LIMIT
  } = require('./constants');

const swaggerOptions = {
  swaggerOptions: {
    tryItOutEnabled: true
  }
};

const bodyParserJsonConfig = () => ({
  parameterLimit: config.common.api.parameterLimit || DEFAULT_PARAMETER_LIMIT,
  limit: config.common.api.bodySizeLimit || DEFAULT_BODY_SIZE_LIMIT
});

const bodyParserUrlencodedConfig = () => ({
  extended: true,
  parameterLimit: config.common.api.parameterLimit || DEFAULT_PARAMETER_LIMIT,
  limit: config.common.api.bodySizeLimit || DEFAULT_BODY_SIZE_LIMIT
});

const app = express();

app.use('/docs', express.static(path.join(__dirname, 'docs')));
app.use('/api/v1/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

// Client must send "Content-Type: application/json" header
app.use(bodyParser.json(bodyParserJsonConfig()));
app.use(bodyParser.urlencoded(bodyParserUrlencodedConfig()));
app.use(expressRequestIdMiddleware);
app.use(
  cors({
    exposedHeaders: ['Authorization']
  })
);
app.use(paginate.middleware(PAGINATE_LIMIT, PAGINATE_MAX_LIMIT));

if (!config.isTesting) {
  app.use(expressMiddleware);
}

routes.init(app);

app.use(errors.handle);

module.exports = app;
