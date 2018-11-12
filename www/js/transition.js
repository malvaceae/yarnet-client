function transition($target) {
  $('section:not(:hidden)').fadeOut('fast', () => {
    $('input', $target).val('');
    $target.fadeIn();
  });
}

$('section').each((i, section) => {
  $(document).on('click', `[data-target="#${section.id}"]`, () => {
    transition($(`#${section.id}`));
    return false;
  });
});
