export class Transition {
    /** 
     * set simple css transition value to HTMLElement
     * @param {string} transitionStyle transition style of element
     * @param {Number} duration transition-duration
     * @param {String} property transition-property
     * @param {number} property transition-delay
     * @param {number} timingFunction transition-timing-function, if value is cubic-bezier function you should pass 'cubic-bezier(.83,.97,.05,1.44)'
    */
    public static MergeTransition(transitionStyle: string, duration: number, property: string, delay: number = 0, timingFunction: string = "") {
        let transitionItems = transitionStyle.split(',').map(trans => {
            if (trans.indexOf(property) < 0)
                return trans;
        })
        transitionItems = transitionItems.concat(`${duration}s ${delay}s ${property} ${timingFunction} `);
        return transitionItems.join(',').replace(/^(\s*,)+|(\s*,)+$/g, "").replace(/(,\s*,)+/, ",");
    }
}