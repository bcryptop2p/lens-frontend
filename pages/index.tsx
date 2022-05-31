import type { NextPage } from 'next';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useSignMessage } from 'wagmi';
import { useEffect, useState } from 'react';
import { authenticate, getPublications, generateChallenge } from '../utils';
import {
  Button,
  Container,
  Heading,
  HStack,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';

const Home: NextPage = () => {
  const { data } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const address = data?.address;
  const connected = !!data?.address;

  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');

  const signIn = async () => {
    const challenge = await generateChallenge(data?.address as string);
    const signature = await signMessageAsync({ message: challenge });
    const accessToken = await authenticate(address as string, signature);
    window.sessionStorage.setItem('accessToken', accessToken);
  };

  useEffect(() => {
    getPublications().then(setPosts);
  }, []);

  return (
    <Container>
      <ConnectButton />
      <Button onClick={signIn}>Sign in</Button>

      <Textarea
        placeholder='Author a post..'
        value={newPostContent}
        onChange={(e) => setNewPostContent(e.target.value)}
      />
      <Button disabled={!newPostContent} marginTop='2'>
        Create post
      </Button>
      <VStack spacing={4} marginY='10'>
        {posts
          .filter((post) => post.__typename === 'Post')
          .map((post) => {
            return (
              <VStack
                key={post.id}
                borderWidth='0.7px'
                paddingX='4'
                paddingY='2'
                rounded='md'
                width='full'
                alignItems='left'
              >
                <Text fontWeight='bold' justifyContent='left'>
                  {post.profile?.name || post.profile?.id}
                </Text>
                <Text>{post.metadata?.content}</Text>

                <HStack>
                  <Text textColor='gray.400'>
                    {post.stats?.totalAmountOfComments} comments,
                  </Text>
                  <Text textColor='gray.400'>
                    {post.stats?.totalAmountOfMirrors} mirrors,
                  </Text>
                  <Text textColor='gray.400'>
                    {post.stats?.totalAmountOfCollects} collects
                  </Text>
                </HStack>
              </VStack>
            );
          })}
      </VStack>
    </Container>
  );
};

export default Home;
