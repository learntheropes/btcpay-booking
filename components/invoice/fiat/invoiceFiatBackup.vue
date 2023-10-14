<script setup>
import nuxtStorage from 'nuxt-storage';
import { NotificationProgrammatic } from "@oruga-ui/oruga-next";

const {
  invoiceId
} = defineProps({
  invoiceId: {
    type: String,
    required: true
  }
});

const { t } = useI18n();

const copy = () => {
  navigator.clipboard.writeText(mnemonic);
  NotificationProgrammatic.open(t('invoiceFiatPaymentDetails.copied', { key: 'backup' }));
}

const download = () => {
  const filename = `${invoiceId}_backup.txt`;
  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(mnemonic));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();
  document.body.removeChild(element);     
};

let mnemonic
onMounted(async () => {

  mnemonic = nuxtStorage.localStorage.getData('bitcoin_mnemonic');

})
</script>

<template>
  <section class="section">
    <div class="ltr-replicate-label">Backup</div>
    <div class="card">
      <div class="card-content">
        <div class="content">{{ $t('invoiceBackup.backupWarning') }}</div>
      </div>
      <footer class="card-footer">
        <a href="#" @click.native="copy" class="card-footer-item">
          <OIcon icon="content-copy" variant="primary" />
        </a>
        <a href="#" @click.native="download" class="card-footer-item">
          <OIcon icon="download" variant="primary" />
        </a>
      </footer>
    </div>
  </section>
</template>
