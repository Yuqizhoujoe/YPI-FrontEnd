export interface projectResource {
    resource: {
        resourceId: number
        cost_Code: string,
        resourceName: string
    },
    project: {
        projectId: number,
        projectName: string
    },
    projectResourceId: number
}