import express, { Router } from 'express';
import { isLoggedIn } from '../middleware/auth.middleware.js';
import {
    addProblemToPlaylist,
    createPlayList,
    deletePlayList,
    getAllListDetails,
    getPlayListDetails,
    removeProblemFromPlaylist,
} from '../controllers/playlist.controllers.js';

const playlistRoutes = express.Router();

playlistRoutes.route('/create-playlist').get(isLoggedIn, createPlayList);

playlistRoutes.route('/').get(isLoggedIn, getAllListDetails);

playlistRoutes.route('/:playlistId').get(isLoggedIn, getPlayListDetails);

playlistRoutes
    .route('/:playlistId/add-problem')
    .post(isLoggedIn, addProblemToPlaylist);

playlistRoutes.route('/:playlistId').delete(isLoggedIn, deletePlayList);

playlistRoutes
    .route('/:playlistId/remove-problem')
    .delete(isLoggedIn, removeProblemFromPlaylist);

export default playlistRoutes;
