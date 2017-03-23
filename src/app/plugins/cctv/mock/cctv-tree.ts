export const CCTVTREE = {
    nodes: [
        {
            type: "server",
            name: 'server node 1',
            nodes: [
                {
                    type: 'server',
                    name: 'server node 11',
                    nodes: [
                        {
                            name: 'video node 111'
                        },
                        {
                            name: 'video node 112'
                        },
                        {
                            name: 'video node 113'
                        },
                    ]
                },
                {
                    type: 'server',
                    name: 'server node 12',
                    nodes: [
                        {
                            type: 'video',
                            name: 'video node 121'
                        },
                        {
                            type: 'video',
                            name: 'video node 122'
                        },
                        {
                            type: 'video',
                            name: 'video node 123'
                        },
                    ]
                }
            ]
        },
        {
            type: "server",
            name: 'server node 2',
            nodes: [
                {
                    type: 'server',
                    name: 'server node 21',
                    nodes: [
                        {
                            type: 'video',
                            name: 'video node 211'
                        },
                        {
                            type: 'video',
                            name: 'video node 212'
                        },
                        {
                            type: 'video',
                            name: 'video node 213'
                        },
                    ]
                },
                {
                    type: 'server',
                    name: 'server node 22',
                    nodes: [
                        {
                            type: 'server',
                            name: 'server node 211',
                            nodes: [
                                {
                                    type: 'video',
                                    name: 'video 2111'
                                },
                                {
                                    type: 'video',
                                    name: 'video 2112'
                                }
                            ]
                        }
                    ]
                },
            ]
        },

    ]
}