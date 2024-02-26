import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';

import { getHtmlFromMd } from '../../lib/pptr';

const typeDefs = `
  enum FormatType {
    WECHAT
    ZHIHU
    JUEJIN
  }

  type Query {
    html (
      markdown: String!
      browserWSEndpoint: String
      theme: String
      formatType: FormatType = JUEJIN
    ): String!
  }
`

const resolvers = {
  // TODO: not work
  FormatType: {
    WECHAT: 'wechat',
    ZHIHU: 'zhihu',
    JUEJIN: 'juejin'
  },
  Query: {
    html ({}, {
      markdown,
      browserWSEndpoint,
      theme,
      formatType,
      codeTheme
    }) {
      return getHtmlFromMd(markdown, {
        browserWSEndpoint,
        theme,
        codeTheme,
        formatType: formatType.toLowerCase()
      })
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  rootValue: {},
  formatError (e) {
    console.error(e)
    return e
  }
})

export default startServerAndCreateNextHandler(server);
