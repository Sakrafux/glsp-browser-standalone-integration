/********************************************************************************
 * Copyright (c) 2024 EclipseSource and others.
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
import { GModelIndex, getOrThrow } from '@eclipse-glsp/server';
import { injectable } from 'inversify';
import {
    CategoryModelNode,
    CompHeaderModelElement,
    ModelElement,
    SimpleModelEdge,
    StructModelElement,
    TaskModelNode,
    WorkflowModel
} from './workflow-model';

type Constructor<T> = new () => T;

@injectable()
export class WorkflowModelIndex extends GModelIndex {
    protected idToWorkflowElement = new Map<string, ModelElement>();

    indexWorkflow(workflow: WorkflowModel): void {
        this.idToWorkflowElement.clear();
        for (const element of [...(workflow.nodes.tasks ?? [])]) {
            this.indexTask(element);
        }
        for (const element of [...(workflow.categories ?? [])]) {
            this.indexCategory(element);
        }
        for (const element of [
            ...(workflow.nodes.activities ?? []),
            ...(workflow.edges.simple ?? []),
            ...(workflow.edges.weighted ?? [])
        ]) {
            this.idToWorkflowElement.set(element.id, element);
        }
    }

    indexTask(task: TaskModelNode) {
        this.idToWorkflowElement.set(task.id, task);
        for (const element of [...(task.children ?? [])]) {
            this.idToWorkflowElement.set(element.id, element);
        }
    }

    indexCategory(category: CategoryModelNode) {
        this.idToWorkflowElement.set(category.id, category);
        for (const element of [...(category.children ?? [])]) {
            this.idToWorkflowElement.set(element.id, element);
            const label = (element as CompHeaderModelElement).label;
            if (label) {
                this.idToWorkflowElement.set(label.id, label);
            }
            for (const e of [...((element as StructModelElement).tasks ?? [])]) {
                this.idToWorkflowElement.set(e.id, e);
            }
            for (const e of [...((element as StructModelElement).activities ?? [])]) {
                this.idToWorkflowElement.set(e.id, e);
            }
        }
    }

    findWorkflowElement(elementId: string, predicate?: (test: ModelElement) => boolean): ModelElement | undefined {
        const element = this.idToWorkflowElement.get(elementId);
        if (element && predicate ? predicate(element) : true) {
            return element;
        }
        return undefined;
    }

    override findByClass<G>(elementTypeId: string, constructor: Constructor<G>): G | undefined {
        const element = this.findWorkflowElement(elementTypeId);
        if (element && element instanceof constructor) {
            return element;
        }
        return undefined;
    }

    getWorkflowElement(elementId: string): ModelElement {
        return getOrThrow(this.findWorkflowElement(elementId), `Could not retrieve element with id: '${elementId}'`);
    }

    override getAllByClass<G>(constructor: Constructor<G>): G[] {
        return Array.from(this.idToWorkflowElement.values()).filter(element => element instanceof constructor) as G[];
    }

    getAllWorkflowEdges(): SimpleModelEdge[] {
        return this.getAllByClass(SimpleModelEdge);
    }

    getIncomingWorkflowEdges(node: ModelElement): SimpleModelEdge[] {
        return this.getAllWorkflowEdges().filter(edge => edge.targetId === node.id);
    }

    getOutgoingWorkflowEdges(node: ModelElement): SimpleModelEdge[] {
        return this.getAllWorkflowEdges().filter(edge => edge.sourceId === node.id);
    }
}
