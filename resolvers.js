import { GraphQLError } from "graphql";
import { getCompany } from "./db/companies.js";
import { createJob, deleteJob, getJob, getJobs, getJobsByCompany, updateJob } from "./db/jobs.js";

export const resolvers = {
    Query: {
        company: async (_root, { id }) => {
            const company = await getCompany(id);
            if (!company) {
                throw notFoundError('No company found with id ' + id,);
            }
            return company;
        },
        job: async (_root, { id }) => {
            const job = await getJob(id);
            if(!job){
                throw notFoundError ('No job found by id' + id,)
            }
            return job;
        },
        
        jobs: () => getJobs(),
    },
 
    Mutation: {
        createJob: (_root, {input: {title, description} }, {auth}) => {
            if(!auth) {
                throw unauthorizedError ("Missing authoritation");
            }
            
            const companyId = 'FjcJCHJALA4i'; //Todo set based on user
            return createJob({ companyId, title, description })
        },
        
        deleteJob: (_root, { id }) => deleteJob(id),

        updateJob: (_root, {input: { id, title, description} }) => {
            return updateJob({ id, title, description });
        },
    },



    Company: {
        jobs: (company) => getJobsByCompany(company.id),
    },

    Job: {
        company: (job) => getCompany(job.companyId),
        date: (job) => toIsoDate(job.createdAt),
    },
};

function notFoundError (message) {
    return new GraphQLError(message, {
        extensions: { code: 'NOT_FOUND' },
    });
}

function unauthorizedError (message) {
    return new GraphQLError(message, {
        extensions: { code: 'Unauthorized' },
    });
}

function toIsoDate(value) {
    return value.slice(0, 'yyyy-mm-dd'.length);
}
