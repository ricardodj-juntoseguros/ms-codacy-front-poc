import {
  Tree,
  formatFiles,
  installPackagesTask,
  updateWorkspaceConfiguration,
  readWorkspaceConfiguration,
  names,
  generateFiles,
} from '@nrwl/devkit';
import { Linter } from '@nrwl/linter';
import { libraryGenerator } from '@nrwl/react';

const path = require('path');

export default async function (host: Tree, schema: any) {
  await setWorkspaceConfiguration(host, 'modules');

  await libraryGenerator(host, {
    name: schema.name,
    linter: Linter.EsLint,
    skipFormat: false,
    skipTsConfig: false,
    style: 'scss',
    unitTestRunner: 'jest',
  });

  const { name, className, propertyName, constantName, fileName } = await names(
    schema.name,
  );

  await generateFiles(
    host,
    path.join(__dirname, 'files'),
    `modules/${schema.name}`,
    {
      tmpl: '',
      name,
      className,
      propertyName,
      constantName,
      fileName,
    },
  );

  await setWorkspaceConfiguration(host, 'libs');
  await formatFiles(host);

  return () => {
    installPackagesTask(host);
  };
}

async function setWorkspaceConfiguration(host: Tree, libSrc: string) {
  const workspaceConfigurations = await readWorkspaceConfiguration(host);

  await updateWorkspaceConfiguration(host, {
    ...workspaceConfigurations,
    workspaceLayout: {
      ...workspaceConfigurations.workspaceLayout,
      libsDir: libSrc,
      appsDir: 'apps',
    },
  });
}
