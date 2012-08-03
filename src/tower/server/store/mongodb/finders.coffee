# Future = require('fibers/future')
# Future.prototype._return = Future.prototype.return

# @module
Tower.Store.Mongodb.Finders =
  # Find and return an array of documents.
  #
  # @param [Tower.Model.Scope] cursor A cursor object with all of the query information.
  #
  # @return undefined Requires a callback to get the value.
  find: (cursor, callback) ->
    conditions  = @serializeConditions(cursor)
    options     = @serializeOptions(cursor)

    @_respond callback, (respond) =>
      @collection().find(conditions, options).toArray (error, docs) =>
        unless error
          unless cursor.raw
            for doc in docs
              doc.id = doc['_id']
              delete doc['_id']

            docs = @serialize(docs, true)

            for model in docs
              model.set('isNew', false)

        respond(error, docs)

  _respond: (callback, block) ->
    block.call @, (error, result) =>
      callback.call(@, error, result) if callback

    undefined

  _respondWithFuture: (callback, block) ->
    future = new Future
    
    block.call @, (error, result) =>
      future._return([error, result])

    [error, result] = future.wait()

    if callback
      callback.call(@, error, result)
    else
      throw error if error
      
    result

  # @return undefined Requires a callback to get the value.
  findOne: (cursor, callback) ->
    cursor.limit(1)
    conditions = @serializeConditions(cursor)

    @collection().findOne conditions, (error, doc) =>
      unless cursor.raw || error || !doc
        doc = @serializeModel(doc)
        doc.persistent = true

      callback.call(@, error, doc) if callback

    undefined

  # @return undefined Requires a callback to get the value.
  count: (cursor, callback) ->
    conditions = @serializeConditions(cursor)

    @collection().count conditions, (error, count) =>
      callback.call @, error, count || 0 if callback

    undefined

  # @return undefined Requires a callback to get the value.
  exists: (cursor, callback) ->
    conditions = @serializeConditions(cursor)

    @collection().count conditions, (error, count) =>
      callback.call(@, error, count > 0) if callback

    undefined

if Tower.isSync
  Tower.Store.Mongodb.Finders.respond = Tower.Store.Mongodb.Finders._respondWithFuture

module.exports = Tower.Store.Mongodb.Finders
