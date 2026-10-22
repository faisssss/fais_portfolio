import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { PORTFOLIO_ID, sanityConfig } from '../content/sanity'
import { schemaTypes } from './schema'

/** The Portfolio is a single document: no "create new", no delete, no duplicate. */
const SINGLETON_ACTIONS = new Set(['publish', 'discardChanges', 'restore'])

export const studioConfig = defineConfig({
  name: 'default',
  title: 'Shefin Shafi — Admin',
  projectId: sanityConfig.projectId,
  dataset: sanityConfig.dataset,
  basePath: '/admin',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Website')
          .items([
            S.listItem()
              .title('Portfolio')
              .id(PORTFOLIO_ID)
              .child(S.document().schemaType('portfolio').documentId(PORTFOLIO_ID).title('Portfolio')),
          ]),
    }),
  ],
  schema: { types: schemaTypes },
  document: {
    newDocumentOptions: (prev) => prev.filter((item) => item.templateId !== 'portfolio'),
    actions: (prev, { schemaType }) =>
      schemaType === 'portfolio' ? prev.filter((action) => action.action && SINGLETON_ACTIONS.has(action.action)) : prev,
  },
})
