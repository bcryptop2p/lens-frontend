import type { NextPage } from 'next';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useSignMessage } from 'wagmi';
import { useEffect, useState } from 'react';
import { authenticate, getPublications, generateChallenge } from '../utils';
import {
  Avatar,
  Button,
  Container,
  Heading,
  HStack,
  Link,
  Skeleton,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { Post } from '../types';

const Home: NextPage = () => {
  const { data } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const address = data?.address;
  const connected = !!data?.address;
  const [signedIn, setSignedIn] = useState(false);

  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostContent, setNewPostContent] = useState('');

  const signIn = async () => {
    if (!connected) {
      return alert('Please connect your wallet first');
    }
    const challenge = await generateChallenge(data?.address as string);
    const signature = await signMessageAsync({ message: challenge });
    const accessToken = await authenticate(address as string, signature);
    window.sessionStorage.setItem('accessToken', accessToken);
    setSignedIn(true);
  };

  useEffect(() => {
    getPublications().then(setPosts);
  }, []);

  return (
    <Container paddingY='10'>
      <ConnectButton showBalance={false} />
      {!signedIn && (
        <Button onClick={signIn} marginTop='2'>
          Login with Lens
        </Button>
      )}

      <Textarea
        placeholder='Author a post..'
        value={newPostContent}
        onChange={(e) => setNewPostContent(e.target.value)}
        marginTop='4'
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
                <HStack>
                  <Avatar src={post.profile.picture.original.url} />
                  <Text fontWeight='bold' justifyContent='left'>
                    {post.profile?.handle || post.profile?.id}
                  </Text>
                </HStack>

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

                  <Link
                    isExternal={true}
                    href={`https://lenster.xyz/posts/${post.id}`}
                    marginLeft='auto'
                  >
                    View on Lenster ↗
                  </Link>
                </HStack>
              </VStack>
            );
          })}

        {posts.length === 0 || !posts ? (
          <VStack>
            {[...Array(10)].map((_, idx) => {
              return <Skeleton key={idx} height='32' width='xl' rounded='md' />;
            })}
          </VStack>
        ) : null}
      </VStack>
    </Container>
  );
};

export default Home;
