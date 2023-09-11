<script setup>
import nuxtStorage from 'nuxt-storage';

// Mock the seller pgp public key to encrypt new chat messages
const sellerPublicKey = `-----BEGIN PGP PUBLIC KEY BLOCK-----

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
/i08+cdA6R70ww==
=93+5
-----END PGP PUBLIC KEY BLOCK-----`
  
// mock the seller pgp encrypted chat message
const sellerEncryptedMessage = `-----BEGIN PGP MESSAGE-----

wV4DWatDK8rX4XgSAQdAExBRI7Vh9IMch+zn9zjroN7o8IeCRceUsuM8JBqF
rgcw55xpC7/iG8p9O0oreqPjLV+IsSKRrZqLTW5s0Ksc4AGOlWEmIrM+qE4A
8ffSG75WwcFMA57HSE6zlWY4ARAAmGvPXD8jMq6DzPM7tr2itMfdXxn2jVws
+BGqqFYsj3ZKlEmZ5nu9sh9au9WYjlU2YxZONXktOsm9E/pT0lqZuLkt2jDl
7ptyOZjtVO1dVDRPlx2KVeKnFc/Q5gJDKInrWaPIxBenZskpkD+qt2365qH2
4LtHau5DavNWQhDSKC4s4JV8D3xnkYFaRbDO337ugfv6y6mzIbIoS8dKowPc
CBKzOT4AM3FWlV22Bfvh2ctsPUlNNptsJSoI+kJOXr3omRwwTT8sVjRvuMCP
ZZCiAZzjpTGErXCmEFgQDqfSM5azn04d5gG2lPB5db4k1NYXC6rTiX1PT3yY
+ZwKb3S5zMhdR3lR3tH1q7sNGjg8K1h98enrbb8Yiwxwz/ZQN1BkeJVDBU3N
0ApeNRK8aaK7UaDlOoyzlveyOp6AoR2KKhSM42aT2UEnlcSLjLJn2qTZKfcQ
4mri5luLStku2998Buz5iVNcF6XNogQ5Fc3U/f7J4NDWMqvF9F1jBw/0LinM
k5xkWUK19VA+bowkHAeRftvo6pzd2fpydeTlC78UhHcGX44abaEtvM17E4hu
hve8ZjtuqRK3rKvrokEEGyZPFNqoL8Zj4qXCb3vzgC30nnZBBgCe8JkMmTQd
ZndWifEvfmglrHg+Wfvg1buHk8QqcN7cFychxEwOPuDE7erk4TDSweYBkm7p
u+fVKAenLpX1v1T7GvtcuibfHhNm301rofbxPlt0QfB62mFPf41cBUrpbkz/
kFXE8Ez1OMy27WDKsgNqTvFEOJF1j2Gsm0bS95iTrnIo0RQGUr3V92M2I/cV
ZpsEEGn0kCmeVANNwc5yu2OhbxCUqgimSr561aKp92bYIxFKfkbl/BxNzaxk
U0iKrQJSXkA9KohrfhqR54oMyah71rq2iky7AFEDGuxX9rOmcxb8ql3Z23sp
sZFNdvrYIuRiXmRYnSyuG+SBG8fUpeGgVD0lJXS/QicTRVvWvinFVdqZ8B0n
AOXxKBuRbygyx5MB3fTo+9+kIB5MezzFB33mOHO3FuDfF1GinRR0KDFwiFY+
PZYOhu8OZ4HsZkAXRjM59xvVfn4TMCDAf3n6iOUShSDalEUCpipkGl8+SxRX
NmfQpe5dY5BjboKHLS1cC/nZSR81OVDVioioiwC2P0BTvNSpt+DlZXAuRJQS
Lk+oU2+l12aNz24tQLFZuSi3I21+yB6FP5z6vofimZi4P/44ZhngIS3ylvRE
T8W3lESsqiLB4L7rw1zRNkKPwkisAqpiswhNzmlRiVjYZEUv0xLNgQpS3HPH
R9OvQiO9IUuqXDhp7yQxrowGuztfMhqXqenEz5prWE9eIKyQBrSDuwvF2tWi
EuW6B2g+XhF9PVi6GB3rynmaBwk3fuFIqX5oJ0kMElGMctIjYkHnxF+4IJpt
bL6wWhefGNYv+AA0D3uUCSeV3ycHHw2YckKpgE20qa5O9duQz+flhfK5B4K5
Nliabn+FMAPeWqgYbYzsYneVMwEq6cVIGn20RmGQo1fDQlLrHflWumcCLgOX
3mXgCR4xVekwodSSLYSZHfAskQgrmTUX2jIUd9O4GBufAFUJkAyI/gp89ME=
=Nir6
-----END PGP MESSAGE-----`

// Moch the seller chat message pgp signature
const sellerSignature = `-----BEGIN PGP SIGNATURE-----

wsFzBAEBCAAnBYJk/l26CZBYx5gQD/inQxYhBFunilEM2kQTK9xR+ljHmBAP
+KdDAABh5A//er2NAbSi/ukaSWQgcD/M1bR5SfeagD/09Cp4FJZ16+O6IkWG
Hpqv4A8hxe6M/wkj43BYy9w2ApvJ0FQ9StT1fdVD1ypxsRLGVAFQE0ilDzXv
xAYqyKgCPwE2AyGWD5r3xoxAOWUn0Zhx49zBhmFuaOKY1PXETAKavfzNn70n
wBtA5dZtB6co6KLKMvACXWvGGY+mtxlDn7RVxFSq7y/HcZ6iO+wxg1SEzrD2
wYmMBfi0VBlfKcmmx5fnLACPTPMYPFQIpOBqHeMg+m69BOlulz3uRvzoozlM
k5C0VX6tofuxtk2PNeEZIQb3HkuA+2Ysh9mvyY7562po1zYcmC27ApLQyHMB
rsyOX93oI83GXFrRy5Hi2FjegYOWG8778WE0gH1/dqSRQwL60bN1RJlU0nPx
aE2B+ElAYpBkXAGIm1K7rAGVB62ogutshDQ8U8UHitWylpXBxHBz3netjoy9
p1uyhHPqy8RTk3F5pWtnPCZm9OOd+w+gAZMeJk8f4VcBXH6R3Nx6bIcmBxDM
7/zEGHlEC4Ga/C+oerKIzt9SBY8p4zXraGaT5UX+inbLhfMqw0LXQbhi08cz
dchrH0AQ8GPWoCUcZStDzVUgzmOdML/evPcZgslojnWtVx/XaGUQqkKOCru1
zm9VR/8pwPfelHVAaJFST0lp6YWfLB/vI88=
=F0Kt
-----END PGP SIGNATURE-----`

const buyerEncryptedMessage = `-----BEGIN PGP MESSAGE-----

wcFMA57HSE6zlWY4AQ//eNsPSyKcfu7/r7wvv+gpYLFE7x/y71UPeS6DKTr1
qxT7YzfBootoM6bAaWMrrjVH0W6uSoVB+IXJnmP81VtlmOO193ZOmP9THVPD
6R4b8aTj5WUdZ8iahgXNKR2qv2ixF0PHQSTY9q7FWiSX75ZQH2gsXUL2Ntmu
hEBy9jFGNP/kIdETLc5SdkJWz8SKQV2gxe4kfQxh7YqDJRPgouKLTgGovS2z
mdA+QqmQBqq0mP/zJdp86ltNqelUEmTffq55XzRi38WTE27L/HDiGeW2xH4I
Ze6GiNo33BmQve70/U4akzJpUu2igXol/BWPOnxBD700lkDCqbhyQ2JRAmxy
E16duPfD7xQ/NvKfPpuj5aSUiBe+C0rerWm+4j1QS077ynQG2L+atncR4QmW
2yfS7fYh5o5tSfXreDFsZsYNeS8pF4N1a5v9HSSaVYUk82xH8arf9zMCkBWq
7thXkrgndhfBNadHxxdsLIz9E5rxztNZPEFww3caIs6YxXleICR6TdIU9n19
nUZy3HE/0txlDgF6L5vnmnBMoToVIzKX4hTdzP5hMEvfXAJn5QK8fK/Dv7GA
NMRSVA8f3pmqWZKDDNpM87msfXSMiPxt+qbm+CEI8CnJFc5VovVo9RDEaog/
dFKGvAYZYg1PPKAnJPv3Rc9SHtx/JC44evtX43Ycn5DBXgNZq0MrytfheBIB
B0CEqyfR2OAdMdz0dRv/i29i6lIG62N0/JL/MRaacWuVAzCcMCXdxI6izK4O
C5/aikmqCJSym5JXd/sm469PaFMZYxsBuyarHuu/IO/eaAKdoxXSwBABpMDN
QAEx+NjncCQhL0bKIobScWpviHi170CNxf6K7W0k4OtiNxC9cV6z3MicV+9W
kQ+/boJw93yYji7oMcJ9Xw8cSLlb4BuLVWr63hCK4bO+hcI0hjh1thd0BQW0
mIOT00FUXcC0teXk869id7h8RpWX1FS+CkyyZ+cyBg4htsKOrfHstLIlOK8P
rlWZ9CLKYRjvmzGS9xNX58z7/QRUjzu8tdRx/G6iu6LPgHDVfAWV0n8lujRr
/QseEAh6St8N1fyv6qHOV+7K71ImYSv2
=We2Z
-----END PGP MESSAGE-----`

const buyerSignature = `-----BEGIN PGP SIGNATURE-----

wnUEARYKACcFgmT+nT4JkEM0irWqVodgFiEEkKW2zADmkCWgFi/mQzSKtapW
h2AAADgOAP4i42Gf5ZOBHhsHwbgJIVi04o3pI7FU6QvSsw2q+DabrAD/VZk5
PerhwpjRYmuXzjbvwLPbkpLqnAmAn2FIIVanigQ=
=W0Ob
-----END PGP SIGNATURE-----`

// Get needed functions from plugins
const {
  // Function to format time
  $dayjs,
  // Handle pgp keys
  $pgp,
} = useNuxtApp();

// Set the new chat message html form with validation
const initialForm = {
  newMessage: ''
}

const form = ref(initialForm);

const validationSchema = {
  newMessage: {
    required: true
  }
}

// Function to encrypt and post a new peach chat message
const postChatMessage = async () => {
  const message = await $pgp.encryptMessage(form.value.newMessage, sellerPublicKey);
  const signature = await $pgp.signMessage(form.value.newMessage);
  console.log({ message, signature })
  return({ message, signature })
}

const chatMessages = ref([]);
onMounted(async () => {

  // Get the buyer uniqueId
  const buyerPeachUniqId = nuxtStorage.localStorage.getData('peach_uniqe_id');

  // Get the user pgp publica key from localStorage
  // to determinate if the chat message belong to the buyer or the seller
  const buyerPublicKey = nuxtStorage.localStorage.getData('pgp_public_key');

  // Mock chat log from peach api
  const chatLogApiResponse = [
    {
      "date": "2023-09-07T14:41:41.605Z",
      "from": "26dc...5de2",
      "message": sellerEncryptedMessage,
      "readBy": ["26dc...5de2"],
      "roomid": "123-456",
      "signature": sellerSignature
    },
    {
      "date": "2023-09-08T14:41:41.605Z",
      "from": buyerPeachUniqId,
      "message": buyerEncryptedMessage,
      "readBy": ["26dc...5de2"],
      "roomid": "123-456",
      "signature": buyerSignature
    },
  ]

  // Decrypt the pgp encrypted chat log
  for (const message of chatLogApiResponse ) {
    if (message.from === buyerPeachUniqId) {
      chatMessages.value.push({
        from: 'buyer',
        text: await $pgp.decryptMessage(message.message, message.signature, buyerPublicKey, false),
        date: message.date
      })
    } else {
      chatMessages.value.push({
        from: 'seller',
        text: await $pgp.decryptMessage(message.message, message.signature, sellerPublicKey, true),
        date: message.date
      })
    }
  }
})
</script>

<template>
  <section v-if="chatMessages" class="section">
    <div class="ltr-replicate-label">Chat</div>
    <div 
      class="block"
      v-for="{ date, text, from } in chatMessages"
      :key="date"
    >
      <div class="columns is-mobile">
        <div v-if="from === 'buyer'" class="column is-one-third has-text-7 is-italic has-text-primary"></div>
        <div :class="(from === 'buyer') ? 'column is-two-thirds has-text-primary has-text-right' : 'column is-two-thirds'">
          <div class="has-text-7 is-italic">{{ $dayjs(date).fromNow() }}</div>
          <div>{{ text  }}</div>
        </div>
        <div v-if="from !== 'buyer'" class="column is-one-third has-text-7 is-italic has-text-right"></div>
      </div>
    </div>
    <VForm
      name="chat"
      :validation-schema="validationSchema"
      @submit="postChatMessage"
    >
      <VField
        name="newMessage"
        :label="$t('newChatMessage')"
        v-slot="{ handleChange, handleBlur, value, errors }"
        v-model="form.newMessage"
      >
        <OField
          :label="$t('newChatMessage')"
          :variant="errors[0] ? 'danger' : null"
          :message="errors[0] ? errors[0] : ''"
        >
          <OInput
            type="textarea"
            :model-value="value"
            @update:modelValue="handleChange"
            @change="handleChange"
            @blur="handleBlur"
            expanded
            :maxlength="100"
            :hasCounter="true"
          />
        </OField>
      </VField>
      <OField>
        <OButton
          variant="primary"
          native-type="submit"
          expanded
        >{{ $t('postChatMessage') }}</OButton>
      </OField>
    </VForm>
  </section>
</template>