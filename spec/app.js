import express from 'express';
import methodOverride from 'method-override';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride());

export default {
  start(config, readyCallback) {
    if (!this.server) {
      this.app = app;
      this.server = app.listen(config.port, () => {
        console.log(
          'Express server listening on port %d in %s mode',
          config.port,
          app.settings.env,
        );

        if (readyCallback) readyCallback();
      });
    }
  },
  close() {
    this.server.close();
  },
};
