import { v2 as compose } from 'docker-compose';
import { logOutput, isContainerRunning } from './docker-util';

describe('when upAll is called', () => {
  it('should successful run', async () => {
    await compose.upAll({ cwd: __dirname, log: logOutput });
    expect(await isContainerRunning('/docker-util-alpine-1')).toBeTruthy();
    await compose.down({ cwd: __dirname, log: logOutput });
  }, 15000);
});