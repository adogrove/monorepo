# Usage
After installing the package, you can now decorate your translatable fields with the `@translation` decorator leveraging [model-level overrides](https://lucid.adonisjs.com/docs/schema-classes#model-level-overrides).

```ts
import { translation } from '@adogrove/adonis-translatable'
// [...]
class Post extends PostSchema {
    @translation()
    declare title: Translation
    
    @translation()
    declare body: Translation
}
```

In your migrations, the translatable fields must be a `json` column.

```ts
export default class extends BaseSchema {
    protected tableName = 'posts'
    
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.json('title')
            table.json('body')
        })
    }
    
    async down() {
        this.schema.dropTable(this.tableName)
    }
}
```
When using your model, you can now access the translated fields.

```ts
const post = await Post.find(1)
post.title.get('fr')
```

You can access it and throw it if it doesn't exist.

```ts
const post = await Post.find(1)
post.title.getOrFail('fr')
```

You can also set the translated fields.

```ts
const post = await Post.find(1)
post.title.set('fr', 'Mon titre')
```

Or fully replace the translations.

```ts
import { Translation } from '@adogrove/adonis-translatable'
// [...]

const post = await Post.find(1)
post.title = Translation.from({
    fr: 'Mon titre',
    en: 'My title',
})
```

`@translation` also allow supplementary options to pass to the inner `@column`, but options must match the schema class decorator.

```ts
import { translation } from '@adogrove/adonis-translatable'
// [...]

class Post extends BaseModel {
    @column()
    declare id: number
    
    @translation({ columnName: 'post_title' })
    declare title: Translation
}
```