<?php

/**
 * @file
 * Contains ProductivityMeResource.
 */

class ProductivityMeResource extends \RestfulEntityBaseUser {

  /**
   * Overrides \RestfulEntityBase::controllers.
   */
  protected $controllers = array(
    '' => array(
      \RestfulInterface::GET => 'viewEntity',
    ),
  );

  /**
   * Overrides \RestfulEntityBaseUser::publicFieldsInfo().
   */
  public function publicFieldsInfo() {
    $public_fields = parent::publicFieldsInfo();

    unset($public_fields['self']);


    if (field_info_field('og_user_node')) {
      $public_fields['companies'] = array(
        'property' => 'og_user_node',
        'resource' => array(
          'company' => 'companies',
        ),
      );
    }

    return $public_fields;
  }

  /**
   * Overrides \RestfulEntityBase::viewEntity().
   *
   * Always return the current user.
   */
  public function viewEntity($entity_id) {
    $account = $this->getAccount();
    return parent::viewEntity($account->uid);
  }
}
