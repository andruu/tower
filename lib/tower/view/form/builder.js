var __slice = Array.prototype.slice;

Tower.View.Form.Builder = (function() {

  function Builder(options) {
    if (options == null) options = {};
    this.template = options.template;
    this.model = options.model;
    this.attribute = options.attribute;
    this.parentIndex = options.parentIndex;
    this.index = options.index;
    this.tabindex = options.tabindex;
    this.accessKeys = options.accessKeys;
  }

  Builder.prototype.defaultOptions = function(options) {
    if (options == null) options = {};
    options.model || (options.model = this.model);
    options.index || (options.index = this.index);
    options.attribute || (options.attribute = this.attribute);
    options.template || (options.template = this.template);
    return options;
  };

  Builder.prototype.fieldset = function() {
    var args, block, options;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    block = args.pop();
    options = this.defaultOptions(Tower.Support.Array.extractOptions(args));
    options.label || (options.label = args.shift());
    return new Tower.View.Form.Fieldset(options).render(block);
  };

  Builder.prototype.fields = function() {
    var attrName, options;
    options = args.extractOptions;
    options.as = "fields";
    options.label || (options.label = false);
    attrName = args.shift() || attribute.name;
    return template.captureHaml(function() {
      var result;
      result = field(attrName, options(function(_field) {
        return template.hamlConcat(fieldset(block).gsub(/\n$/, ""));
      }));
      return template.hamlConcat(result.gsub(/\n$/, ""));
    });
  };

  Builder.prototype.fieldsFor = function() {
    var attrName, attribute, index, keys, macro, options, subObject, subParent;
    options = args.extractOptions;
    attribute = args.shift;
    macro = model.macroFor(attribute);
    attrName = nil;
    if (options.as === "object") {
      attrName = attribute.toS;
    } else {
      attrName = config.renameNestedAttributes ? "" + attribute + "_attributes" : attribute.toS;
    }
    subParent = model.object;
    subObject = args.shift;
    index = options["delete"]("index");
    if (!((index.present != null) && typeof index === "string")) {
      if ((subObject.blank != null) && (index.present != null)) {
        subObject = subParent.send(attribute)[index];
      } else if ((index.blank != null) && (subObject.present != null) && macro === "hasMany") {
        index = subParent.send(attribute).index(subObject);
      }
    }
    subObject || (subObject = model["default"](attribute) || model.toS.camelize.constantize["new"]);
    keys = [model.keys, attrName];
    options.merge({
      template: template,
      model: model,
      parentIndex: index,
      accessKeys: accessKeys,
      tabindex: tabindex
    });
    return new Tower.View.Form.Builder(options).render(block);
  };

  Builder.prototype.field = function() {
    var args, attributeName, block, defaults, options;
    args = Tower.Support.Array.args(arguments);
    block = Tower.Support.Array.extractBlock(args);
    options = Tower.Support.Array.extractOptions(args);
    attributeName = args.shift() || "attribute.name";
    defaults = {
      template: this.template,
      model: this.model,
      parentIndex: this.parentIndex,
      index: this.index,
      fieldHtml: options.fieldHtml || {},
      inputHtml: options.inputHtml || {},
      labelHtml: options.labelHtml || {},
      errorHtml: options.errorHtml || {},
      hintHtml: options.hintHtml || {}
    };
    return new Tower.View.Form.Field(_.extend(defaults, options)).render(block);
  };

  Builder.prototype.button = function() {
    var options;
    options = args.extractOptions;
    options.reverseMerge({
      as: "submit"
    });
    options.value = args.shift || "Submit";
    return field(options.value, options, block);
  };

  Builder.prototype.submit = function() {
    return template.captureHaml(function() {
      var result;
      result = fieldset({
        "class": config.submitFieldsetClass(function(fields) {
          template.hamlConcat(fields.button.apply(fields, args).gsub(/\n$/, ""));
          if (block) return yield(fields);
        })
      });
      return template.hamlConcat(result.gsub(/\n$/, ""));
    });
  };

  Builder.prototype.partial = function(path, options) {
    if (options == null) options = {};
    return this.template.render({
      partial: path,
      locals: options.merge({
        fields: self
      })
    });
  };

  Builder.prototype.tag = function() {
    var args, key;
    key = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    return this.template.tag(key, args);
  };

  Builder.prototype.render = function(block) {
    return block(this);
  };

  return Builder;

})();