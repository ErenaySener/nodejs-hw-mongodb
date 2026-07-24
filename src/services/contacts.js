import { Contact } from '../db/models/contact.js';

export const getAllContacts = async(
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  filters = {},
  userId,
) => {
  const skip = (page - 1) * perPage;
  const query = {
  ...filters,
  userId,
};

  const contacts = await Contact.find(query)
    .skip(skip)
    .limit(perPage)
    .sort({
      [sortBy]: sortOrder,
    });

  const totalItems = await Contact.countDocuments(query);

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
};

export const getContactById = async (contactId, userId) => {
  const contact = await Contact.findOne({
    _id: contactId,
   userId,
  });

  return contact;
};

export const createContact = async (payload, userId) => {
  const contact = await Contact.create({
    ...payload,
    userId,
  });

  return contact;
};

export const updateContact = async (contactId, payload, userId) => {
  const contact = await Contact.findOneAndUpdate(
    {
      _id: contactId,
      userId,
    },
    payload,
    {
      new: true,
    },
  );

  return contact;
};

export const deleteContact = async (contactId, userId) => {
  const contact = await Contact.findOneAndDelete({
    _id: contactId,
    userId,
  });

  return contact;
};