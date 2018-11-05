function transition($target) {
  $('section:not(:hidden)').fadeOut('fast', () => {
    $('input', $target).val('');
    $target.fadeIn();
  });
}

$('section').each((i, section) => {
  $(`[data-target="#${section.id}"]`).on('click', () => {
    transition($(`#${section.id}`));
    return false;
  });
});
