import { readFileSync } from 'fs'
import { join } from 'path'

const configPath = join(process.cwd(), 'src', 'config.json')
const fileContent = JSON.parse(readFileSync(configPath, 'utf8'))

// We merge the file config with environment variables here
export const config = {
  rest: {
    basePath: fileContent.rest.basePath,
    subpaths: fileContent.rest.subpaths
  }
}