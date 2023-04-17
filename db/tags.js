const client = require("./index");

async function createTag(name) {
  //creates a tag with the given name
  try {
    await client.connect();

    const { rows } = await client.query(
      `
        SELECT * FROM tags
        WHERE name = ($1);
        `,
      [name]
    );
    if (rows.length > 0) {
      console.log(`Tag with name "${name}" already exists`);
      return;
    }
    const { rows: tag } = await client.query(
      `
            INSERT INTO tags(name)
            VALUES ($1)
            RETURNING *
            `,
      [name]
    );
    await client.release();
    return tag;
    //returns the newly created tag
  } catch (e) {
    console.error(e);
  }
}

async function getAllTags() {
  //gets all tags from the database
  try {
    client.connect();

    const { rows: tags } = await client.query(`
            SELECT * FROM tags
        `);

    await client.release();
    return tags;
    //returns an array of all tags
  } catch (e) {
    console.error(e);
  }
}

async function getTagById(tagId) {
  //gets all the info from a specific tag based on the given id
  try {
    client.connect();

    const {
      rows: [tag],
    } =
      // selects all information from tags where the id is equal to $1
      await client.query(
        ` 
          SELECT *
          FROM tags
          WHERE id = $1;
        `,
        [tagId]
      );

    await client.release();
    return tag;
    // returns all the tag info from a specific tag based on the id its given
  } catch (e) {
    console.error(e);
  }
}

//updates a tag based on the given tagId and fields
async function updateTag({ tagId, name }) {
  try {
    await client.connect();

    const {
      rows: [tag],
    } = await client.query(
      `
          UPDATE tags
          SET name = $1
          WHERE id = $2
          RETURNING *;
      `,
      [name, tagId]
    );

    await client.release();
    return tag;
    //returns the updated tag
  } catch (e) {
    console.error(e);
  }
}

async function deactivateTag(tagId) {
  //switches a tag from active to inactive so that it won't display
  try {
    await client.connect();

    const { rowCount } = await client.query(
      `
      UPDATE tags
      SET active = false
      WHERE id=$1;
      `,
      [tagId]
    );

    await client.release();
    return rowCount;
    //returns the deactivated tag back
  } catch (e) {
    console.error(e);
  }
}

async function deleteTag(tagId) {
  //deletes a tag based on the tagId given
  try {
    await client.connect();

    const {
      rows: [tag],
    } = await client.query(
      `
         DELETE FROM tags
         WHERE id=$1
         RETURNING *;
        `,
      [tagId]
    );

    await client.release();

    return tag;
    //returns all tags minus the one deleted
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  createTag,
  getAllTags,
  getTagById,
  updateTag,
  deactivateTag,
  deleteTag,
};
