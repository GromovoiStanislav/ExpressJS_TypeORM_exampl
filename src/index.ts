import express, { Request, Response } from 'express';
import { validate } from 'class-validator';

import { User } from './entity/User';
import { Post } from './entity/Post';
import dataSource from './db/data-source';

dataSource
  .initialize()
  .then(async () => {
    const app = express();
    app.use(express.json());

    // CREATE
    app.post('/users', async (req: Request, res: Response) => {
      const { name, email, role } = req.body;

      try {
        const user = User.create({ name, email, role });

        const errors = await validate(user);
        if (errors.length > 0) throw errors;

        await user.save();
        return res.status(201).json(user);
      } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Something went wrong' });
      }
    });

    // READ
    app.get('/users', async (_: Request, res: Response) => {
      try {
        const users = await User.find({ relations: ['posts'] });
        return res.json(users);
      } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Something went wrong' });
      }
    });

    // UPDATE
    app.put('/users/:id', async (req: Request, res: Response) => {
      const uuid = req.params.id;
      const { name, email, role } = req.body;

      try {
        const user = await User.findOneOrFail({ where: { uuid } });

        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;

        await user.save();
        return res.json(user);
      } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Something went wrong' });
      }
    });

    // DELETE
    app.delete('/users/:id', async (req: Request, res: Response) => {
      const uuid = req.params.id;

      try {
        const user = await User.findOneOrFail({ where: { uuid } });

        await user.remove();

        return res.json({ message: 'User deleted successfully' });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Something went wrong' });
      }
    });

    // FIND
    app.get('/users/:id', async (req: Request, res: Response) => {
      const uuid = req.params.id;

      try {
        const user = await User.findOneOrFail({
          where: { uuid },
          relations: ['posts'],
        });

        return res.json(user);
      } catch (err) {
        console.log(err);
        return res.status(404).json({ user: 'User not found' });
      }
    });

    // Create a Post
    app.post('/posts', async (req: Request, res: Response) => {
      const { userId, title, body } = req.body;

      try {
        const user = await User.findOneOrFail({ where: { uuid: userId } });

        const post = new Post({ title, body, user });

        await post.save();

        return res.status(201).json(post);
      } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Something went wrong' });
      }
    });

    // Read posts
    app.get('/posts', async (req: Request, res: Response) => {
      try {
        const posts = await Post.find({ relations: ['user'] });

        return res.json(posts);
      } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Something went wrong' });
      }
    });

    app.listen(3000, () => console.log('Server up at http://localhost:3000'));
  })
  .catch((error) => console.log(error));
