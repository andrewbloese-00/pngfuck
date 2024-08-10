
//expected <spawn:number>,<survival:number>,<states:number>
const ruleSchema = "<spawn:number>,<survival:number>,<states:number>"

const parseRule = str => {
    const [spawn,survival,states] = str.split(",").map(Number)
    if( (!spawn || isNaN(spawn))  || (!survival || isNaN(survival) || (!states || isNaN(states))) )
        throw new Error(`ParseError: expected\n ${ruleSchema}`)

    return { spawn , survival , states}
} 

module.exports = parseRule