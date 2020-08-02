import { NOTE_FRAGMENT } from "./fragments";
import { GET_NOTES } from "./queries";

export const typeDefs = [
  `
    schema {
      query: Query
      mutation: Mutation
    }
    type Query {
      notes: [Note]!
      note(id: Int!): Note
    }
    type Mutation {
      createNote(title: String!, content: String!): Note
      editNote(id: Int!, title: String, content: String): Note
    }
    type Note {
      id: Int!
      title: String!
      content: String!
    }
  `,
];

export const resolvers = {
  Query: {
    notes: (_, __, { cache }) => {
      return cache.readQuery({ query: GET_NOTES });
    },
    note: (_, args, { cache }) => {
      const id = cache.config.dataIdFromObject({
        __typename: "Note",
        id: args.id,
      });
      return cache.readFragment({ id, fragment: NOTE_FRAGMENT });
    },
  },
  Mutation: {
    createNote: (_, args, { cache }) => {
      const { notes } = cache.readQuery({ query: GET_NOTES });
      const { title, content } = args;
      const newNote = {
        __typename: "Note",
        title,
        content,
        id: notes.length + 1,
      };
      cache.writeData({
        data: {
          notes: [newNote, ...notes],
        },
      });
      return newNote;
    },
    editNote: (_, args, { cache }) => {
      const { id, title, content } = args;
      const noteId = cache.config.dataIdFromObject({
        __typename: "Note",
        id,
      });
      const note = cache.readFragment({ fragment: NOTE_FRAGMENT, id: noteId });
      const updatedNote = {
        ...note,
        title,
        content,
      };
      cache.writeFragment({
        id: noteId,
        fragment: NOTE_FRAGMENT,
        data: updatedNote,
      });
      return updatedNote;
    },
  },
};
