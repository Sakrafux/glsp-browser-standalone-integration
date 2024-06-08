/********************************************************************************
 * Copyright (c) 2022-2023 STMicroelectronics and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/
import { CreateNodeOperation, JsonCreateNodeOperationHandler, Point } from '@eclipse-glsp/server';
import { inject, injectable } from 'inversify';
import { ModelTypes } from '../util/model-types';
import { GridSnapper } from './grid-snapper';
import { CategoryModelNode, ModelElement, StructModelElement } from '../model/workflow-model';
import { WorkflowModelState } from '../model/workflow-model-state';

@injectable()
export abstract class CreateWorkflowNodeOperationHandler extends JsonCreateNodeOperationHandler {
    @inject(WorkflowModelState)
    protected override modelState: WorkflowModelState;

    override getLocation(operation: CreateNodeOperation): Point | undefined {
        return GridSnapper.snap(operation.location);
    }

    override getContainer(operation: CreateNodeOperation): ModelElement | undefined {
        const index = this.modelState.index;
        const container = operation.containerId ? index.getWorkflowElement(operation.containerId) : undefined;

        if (container instanceof CategoryModelNode) {
            const structComp = this.getCategoryCompartment(container);
            if (structComp) {
                return structComp;
            }
        }
        return container;
    }

    getCategoryCompartment(category: CategoryModelNode): StructModelElement | undefined {
        return category.children?.find(child => child.type === ModelTypes.STRUCTURE);
    }
}
