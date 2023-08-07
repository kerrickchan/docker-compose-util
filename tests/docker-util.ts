import { default as Docker, ContainerInfo, ImageInfo } from 'dockerode';

export {
  logOutput,
  getAllContainers,
  getRunningContainers,
  imageExists,
  isContainerRunning,
  removeContainers,
  removeImagesStartingWith,
  repoTags,
};

const docker = new Docker();
const logOutput = true;

const isContainerRunning = async (name: string): Promise<boolean> =>
  new Promise((resolve, reject): void => {
    docker.listContainers((err: Error, containers: ContainerInfo[]): void => {
      if (err) {
        reject(err)
      }

      const running = (containers || []).filter((container: ContainerInfo): boolean =>
        container.Names.includes(name)
      )

      console.log('running containers', running)

      resolve(running.length > 0)
    })
  })

const getAllContainers = async (): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    let all = new Array<string>()
    docker.listContainers({ all: true }, (err: Error, containers: ContainerInfo[] = []) => {
      if (err) {
        return reject(err)
      }
      console.log('containers', containers?.length)
      containers?.forEach((container: ContainerInfo) => {
        console.log(container.Id)
        return (all = [...all, container.Id])
      })

      return resolve(all)
    })
  })
}

const getRunningContainers = async (): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    let all = new Array<string>()
    docker.listContainers((err: Error, containers: ContainerInfo[] = []) => {
      if (err) {
        return reject(err)
      }
      console.log('containers', containers?.length)
      containers?.forEach((container: ContainerInfo) => {
        console.log(container.Id)
        return (all = [...all, container.Id])
      })

      return resolve(all)
    })
  })
}

const removeContainers = async (containerIds: string[]) => {
  for (const id of containerIds) {
    const container = docker.getContainer(id)
    await container.remove()
  }
}

const repoTags = (imageInfo: ImageInfo): string[] => imageInfo.RepoTags || []

const imageExists = async (name: string): Promise<boolean> => {
  const images = await docker.listImages()

  const foundImage = images.findIndex((imageInfo): boolean =>
    repoTags(imageInfo).includes(name)
  )

  return foundImage > -1
}

const removeImagesStartingWith = async (
  searchString: string,
): Promise<void> => {
  const images = await docker.listImages()

  for (const image of images) {
    for (const repoTag of repoTags(image)) {
      if (repoTag.startsWith(searchString)) {
        const dockerImage = docker.getImage(repoTag)

        if (logOutput) {
          process.stdout.write(
            `removing image ${repoTag} ${dockerImage.id || ''}`
          )
        }
        await dockerImage.remove()
      }
    }
  }
}
