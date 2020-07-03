const { ApolloServer, gql } = require('apollo-server-express')
const express = require('express')

const { getHtmlFromMd } = require('./pptr')

const typeDefs = gql`
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
    console.error(e.originalError)
    return e
  }
})
const app = express()

server.applyMiddleware({ app })

app.use('/', (req, res) => {
  res.send('hello, shanyue.')
})

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
)

// 为了与腾讯云的 express component 适配
module.exports = app
