<div class="report-container">
  <div id="header" class="show-only-on-print">
    <span id="project-title"><?php print t('Work Report for: @username - @date', array('@username' => $fullname, '@date' => $date)); ?></span>
  </div>

  <?php print $table; ?>
  <div class="row" style="page-break-before: always;">
    <h3>Summary</h3>
    <div class="col-sm-12">
      <?php print $table_summary; ?>
    </div>
  </div>
  <?php if (!empty($table_summary_madaan)): ?>
    <div class="row">
      <h3>Madaan</h3>
      <div class="col-sm-12">
        <?php print $table_summary_madaan; ?>
      </div>
    </div>
  <?php endif; ?>
  <h3>Signatures</h3>
  <div class="row">
    <div class="col-sm-6 mop-manager">
      Brice Lenfant (MOP manager):
    </div>
    <div class="col-sm-6 employee-signature">
      <?php print $fullname; ?>:
    </div>
  </div>
</div>