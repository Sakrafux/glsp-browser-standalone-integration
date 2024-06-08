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

export class WorkflowModel {
    id: string;
    nodes: {
        tasks?: TaskModelNode[];
        activities?: ActivityModelNode[];
    };
    edges: {
        simple?: SimpleModelEdge[];
        weighted?: WeightedModelEdge[];
    };
    categories?: CategoryModelNode[];
}

export class ModelElement {
    id: string;
}

export class CategoryModelNode extends ModelElement {
    type: string;
    name: string;
    position: { x: number; y: number };
    size?: { width: number; height: number };
    children?: (StructModelElement | CompHeaderModelElement)[];
}

export class TaskModelNode extends ModelElement {
    type: string;
    name: string;
    position: { x: number; y: number };
    size?: { width: number; height: number };
    children?: (IconModelElement | LabelModelElement)[];
}

export class ModelSubElement extends ModelElement {
    type: string;
    position: { x: number; y: number };
    size?: { width: number; height: number };
}

export class IconModelElement extends ModelSubElement {}

export class LabelModelElement extends ModelSubElement {
    alignment: { x: number; y: number };
    text: string;
}

export class CompHeaderModelElement extends ModelSubElement {
    label: LabelModelElement;
}

export class StructModelElement extends ModelSubElement {
    tasks?: TaskModelNode[];
    activities?: ActivityModelNode[];
}

export class ActivityModelNode extends ModelElement {
    type: string;
    position: { x: number; y: number };
    size?: { width: number; height: number };
}

export class SimpleModelEdge extends ModelElement {
    routingPoints: RoutingPointModelElement[];
    sourceId: string;
    targetId: string;
}

export class RoutingPointModelElement extends ModelElement {
    kind: string;
    x: number;
    y: number;
    pointIndex: number;
}

export class WeightedModelEdge extends SimpleModelEdge {
    probabilty?: string;
}
