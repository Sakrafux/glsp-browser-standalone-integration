/********************************************************************************
 * Copyright (c) 2022 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied:
 * -- GNU General Public License, version 2 with the GNU Classpath Exception
 * which is available at https://www.gnu.org/software/classpath/license.html
 * -- MIT License which is available at https://opensource.org/license/mit.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0 OR MIT
 ********************************************************************************/
import 'reflect-metadata';

import { createAppModule, LogLevel, ServerModule, WorkerServerLauncher } from '@eclipse-glsp/server/browser';
import { Container } from 'inversify';
import { TaskListDiagramModule } from './diagram/tasklist-diagram-module';

export async function launch(): Promise<void> {
    const appContainer = new Container();
    appContainer.load(createAppModule({ logLevel: LogLevel.debug }));

    const launcher = appContainer.resolve(WorkerServerLauncher);
    const serverModule = new ServerModule().configureDiagramModule(new TaskListDiagramModule());

    launcher.configure(serverModule);
    await launcher.start({});
}

launch().catch(error => console.error('Error in tasklist server launcher:', error));
