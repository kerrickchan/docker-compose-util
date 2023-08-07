export * from 'docker-compose';

export {
  logOutput,
  getAllContainers,
  getRunningContainers,
  imageExists,
  isContainerRunning,
  removeContainers,
  removeImagesStartingWith,
  repoTags,
} from './src/docker-util';
