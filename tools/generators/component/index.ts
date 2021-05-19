import { Tree, formatFiles, installPackagesTask, updateWorkspaceConfiguration, readWorkspaceConfiguration, names, generateFiles, } from '@nrwl/devkit';
import { Linter } from '@nrwl/linter';
import { libraryGenerator } from '@nrwl/react';
const path = require('path');

export default async function (host: Tree, schema: any) {
  const pathReference = schema.reference === 'shared' ? 'libs/shared/ui' : `libs/components/${schema.reference}`
  const { name, className, propertyName, constantName, fileName } = await names(schema.name);

  await setWorkspaceConfiguration(host, pathReference);

  await libraryGenerator(
    host,
    {
      name: schema.name,
      pascalCaseFiles: true,
      linter: Linter.EsLint,
      skipFormat: false,
      skipTsConfig: false,
      style: 'scss',
      unitTestRunner: 'jest',
    }
    );


  await generateFiles(
    host,
    path.join(__dirname, 'files'),
    `${pathReference}/${fileName}`,
    {
      tmpl: '',
      name,
      className,
      propertyName,
      constantName,
      fileName
    }
  )

  await setWorkspaceConfiguration(host, 'libs');
  await formatFiles(host);

  return () => {
    installPackagesTask(host);
  }
}


async function setWorkspaceConfiguration(host:Tree, libSrc:string) {
  const workspaceConfigurations = await readWorkspaceConfiguration(host);

  await updateWorkspaceConfiguration(host,
    {
      ...workspaceConfigurations,
      workspaceLayout: {
        ...workspaceConfigurations.workspaceLayout,
        libsDir: libSrc
      }
    }
  );

  return;
}
